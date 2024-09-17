import Project from "../models/Project.js";
import Sprint from "../models/Sprint.js";
import Task from "../models/Task.js";

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
    res.status(201).json({ message: "Project created successfully", succcess: true });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ message: error.message, success: false });
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
    ]);
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
    const updateData = req.body;
    console.log("updated project: " + req.body)
    const updateproject = await Project.findByIdAndUpdate(
      projectId,
      updateData,
      { new: true }
    );
    if (!updateproject) {
      return res.status(404).json({ message: "Project Not Found" });
    }
    res
      .status(200)
      .json({ message: "Project Update Successfully", success: true, updateproject });
  } catch (error) {
    res.status(500).json({ message: error.message, succcess: false });
  }
}


const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
console.log(projectId);

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

    res.status(200).json({ message: "Project deleted successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
// Get project by sprint ID
const getProjectsBySprintId = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Find projects that include the sprintId in their sprintId field
    const projects = await Project.find({projectId})
      .populate("sprintId", "spritname");

    if (projects.length === 0) {
      return res.status(404).json({ message: "No projects found for this sprint", success: false });
    }

    res.status(200).json({ Data: projectsWithTaskNames, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export {
  CreateProject,
  getAllProject,
  getAllPeojectById,
  updateProject,
  deleteProject,getProjectsBySprintId
};