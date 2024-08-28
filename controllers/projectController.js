const Project = require('../models/Project')
const mongoose = require('mongoose');

const User =require('../models/UserModel')
const validateProjectCreation = require('../middleware/Projectvalidation')

// Create Project Handler
exports.CreateProject = [
    validateProjectCreation,
    async (req, res) => {
      try {
        const { projectName, description, team, owner, status } = req.body;
  
        // Check if a project with the same name already exists
        const existingProject = await Project.findOne({ projectName });
  
        if (existingProject) {
          return res.status(409).json({
            message: "A project with the same name already exists",
            success: false
          });
        }
  
        const newProject = new Project({
          projectName,
          description,
          team,
          owner,
          status,
        });
  
        await newProject.save();
        res
          .status(201)
          .json({ message: "Project created successfully", success: true });

      } catch (error) {
        res.status(500).json({ message: error.message, success: false });
      }
    },
  ];
  

//get all project data 
exports.getAllProject = async (req, res) => {
    try {
        const projects = await Project.find().populate('owner team.id taskId sprintId')
        res.json(200).json({ Data: projects, success: true })
    } catch (error) {
        res.status(500).json({ message: error.message, success: false })
    }
}

//get project by id 
exports.getAllPeojectById = async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await Project.findById(projectId).populate('owner team.id taskId sprintId')
        if (!project) {
            return res.status(404).json({ message: "project not found" })
        }
        res.status(200).json(project)
    }
    catch (error) {
        res.status(500).json({ message: error.message, success: false })
    }
}

//update project 
exports.updateProject = [
    validateProjectCreation,
    async (req, res) => {
      try {
        const projectId = req.params.id;
        const { projectName, description, status, owner, team } = req.body;
  
        // Validate IDs
        if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(owner)) {
          return res.status(400).json({ message: 'Invalid project ID or owner ID', success: false });
        }
  
        if (team) {
          for (const member of team) {
            if (!mongoose.Types.ObjectId.isValid(member.id)) {
              return res.status(400).json({ message: 'Invalid team member ID', success: false });
            }
          }
        }
  
        const updateData = { projectName, description, status, owner };
  
        // Check if project exists
        const project = await Project.findById(projectId);
        if (!project) {
          return res.status(404).json({ message: 'Project Not Found', success: false });
        }
  
        const updatedProject = await Project.findByIdAndUpdate(projectId, updateData, { new: true });
  
        // Update team members
        if (team) {
          for (const member of team) {
            const existingMember = project.team.find((m) => m.id.toString() === member.id);
  
            if (existingMember) {
              // Update role if member already exists
              await Project.updateOne(
                { _id: projectId, "team.id": member.id },
                { $set: { "team.$.role": member.role } }
              );
            } else {
              // Add new member
              await Project.updateOne(
                { _id: projectId },
                { $push: { team: { id: member.id, role: member.role } } }
              );
            }
          }
        }
  
        const finalProject = await Project.findById(projectId).populate('team.id');
        res.status(200).json({ message: 'Project Updated Successfully', success: true, Data:finalProject });
      } catch (error) {
        res.status(500).json({ message: error.message, success: false });
      }
    }
  ];
  

exports.removeMemberFromTeam = async (req, res) => {
    try {
        const { projectId, userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid project ID or user ID', success: false });
        }

        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            { $pull: { team: { id: userId } } }, 
            { new: true }
        ).populate('team.id');

        if (!updatedProject) {
            return res.status(404).json({ message: 'Project Not Found', success: false });
        }

        res.status(200).json({ message: 'Member removed successfully', success: true, project: updatedProject });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

// exports.addMemberToTeam = async (req, res) => {
//     try {
//         const projectId = req.params.projectId;
//         const members = req.body; 

//         if (!mongoose.Types.ObjectId.isValid(projectId)) {
//             return res.status(400).json({ message: 'Invalid project ID', success: false });
//         }

//         for (const member of members) {
//             if (!mongoose.Types.ObjectId.isValid(member.id)) {
//                 return res.status(400).json({ message: 'Invalid team member ID', success: false });
//             }
//         }

//         const project = await Project.findById(projectId);
//         if (!project) {
//             return res.status(404).json({ message: 'Project Not Found', success: false });
//         }

//         for (const member of members) {
//             const { id, role } = member;

//             const memberExists = project.team.some(existingMember => existingMember.id.toString() === id);
//             if (memberExists) {
//                 return res.status(400).json({ message: `Member with ID ${id} already exists in the team`, success: false });
//             }

//             await Project.updateOne(
//                 { _id: projectId },
//                 { $push: { team: { id, role } } }
//             );
//         }

//         const updatedProject = await Project.findById(projectId).populate('team.id');

//         res.status(200).json({ message: 'Members added to the team successfully', success: true, project: updatedProject });
//     } catch (error) {
//         res.status(500).json({ message: error.message, success: false });
//     }
// };

//delete a project 
exports.deleteProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        const deleteProject = await Project.findByIdAndDelete(projectId);
        if (!deleteProject) {
            return res.status(404).json({ message: 'Project Not found' })
        }
        res.status(200).json({ message: "Project Delte Successfully", success: true })

    } catch (error) {
        res.status(500).json({ message: error.message, success: false })
    }
}

