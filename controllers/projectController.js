import Project from "../models/Project.js";
import Sprint from "../models/Sprint.js";
import Task from "../models/Task.js";
import UserModel from "../models/UserModel.js";
import { io, ProjectMember } from "../Socket/Socket.js";
import { projecteNotification, saveOfflineNotification } from "./notificationController.js";

// Create Project Handler
const CreateProject = async (req, res) => {
  try {
    const { projectName, description, dueDate, owner, status } = req.body;

    console.log(req.body)

    // Create a new project
    const newProject = new Project({
      projectName,
      description,
      dueDate,
      owner,
      status,
    });

    // Save the project to the database
    const saveProject = await newProject.save();
    return res.status(201).json({ message: "Project created successfully", succcess: true });
  } catch (error) {
    // Handle server errors
    return res.status(500).json({ message: error.message, success: false });
  }
};

//get all project data
const getAllProject = async (req, res) => {
  try {
    const projects = await Project.find().populate([
      "owner",
      {
        path: "teams",
        populate: {
          path: "members",
        }
      },
      "sprintId"
    ]).populate('teams.teamIDs').populate('teams.memberIDs');
    console.log(projects);
    res.status(200).json({ Data: projects, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

//get project by id
const getAllPeojectById = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId).populate(
      "owner team.id sprintId"
    );
    if (!project) {
      return res.status(404).json({ message: "project not found" });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

//update project
const updateProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const { projectName, description, status, owner, teams } = req.body;

    // Update the project with the new data
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { projectName, description, status, owner, teams },
      { new: true, runValidators: true }
    );

    console.log(teams)

    if (!updatedProject) {
      return res.status(404).json({ message: "Project Not Found", success: false });
    }

    // Fetch the updated project with populated teams and their members
    const populatedProject = await Project.findById(projectId)
      .populate('teams.teamIDs').populate('teams.memberIDs');

    console.log(populatedProject);

    // Get all unique member IDs from all teams
    const teamIds = populatedProject.teams.teamIDs.map(team => team._id.toString());
    const memberIds = populatedProject.teams.memberIDs.map(member => member._id.toString());
    const uniqueMemberIds = [...new Set([...memberIds, ...teamIds])];

    // Get socket IDs for online members
    const onlineSocketIds = ProjectMember(uniqueMemberIds);

    // Notify each online member
    onlineSocketIds.forEach(async (socketId) => {
      if (socketId) {
        // Construct notification message
        const message = `The project "${updatedProject.projectName}" has been updated.`;

        // Send real-time notification via socket.io
        io.to(socketId).emit('projectUpdated', {
          message,
          projectId: updatedProject._id,
          projectName: updatedProject.projectName,
        });
      }
    });

    // Save offline notifications for all members
    uniqueMemberIds.forEach(async (memberId) => {
      const message = `The project "${updatedProject.projectName}" has been updated.`;
      await projecteNotification(memberId, updatedProject._id, message);
    });

    return res.status(200).json({
      message: "Project Updated Successfully",
      success: true,
      project: updatedProject,
    });
  } catch (error) {
    console.error("Error updating project: ", error.message);
    return res.status(500).json({ message: error.message, success: false });
  }
};




const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    //console.log(projectId);

    // Find the project to be deleted
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found", success: false });
    }

    // Delete all associated sprints
    await Sprint.deleteMany({ _id: { $in: project.sprintId } });

    // Delete all associated tasks
    await Task.deleteMany({ _id: { $in: project.taskId } });

    // Delete the project
    await Project.findByIdAndDelete(projectId);

    return res.status(200).json({ message: "Project deleted successfully", success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
// Get project by sprint ID
const getProjectsBySprintId = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Find projects that include the sprintId in their sprintId field
    const projects = await Project.find({ projectId })
      .populate("sprintId", "spritname");

    if (projects.length === 0) {
      return res.status(404).json({ message: "No projects found for this sprint", success: false });
    }

    return res.status(200).json({ Data: projectsWithTaskNames, success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};


export {
  CreateProject,
  getAllProject,
  getAllPeojectById,
  updateProject,
  deleteProject, getProjectsBySprintId,
};