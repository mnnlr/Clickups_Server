const Project = require('../models/Project')
const {body,validationResult}=require('express-validator')
const User =require('../models/UserModel')
const validateProjectCreation = require('../middleware/Projectvalidation')

// Create Project Handler
exports.CreateProject = [
    validateProjectCreation,
    async (req, res) => {
        try {
            const { projectName, description, team, owner, status } = req.body;

            // Create a new project
            const newProject = new Project({
                projectName,
                description,
                team,
                owner,
                status
            });

            // Save the project to the database
            const saveProject = await newProject.save();
            res.status(201).json({ message: "Project created successfully", succcess: true });
        } catch (error) {
            // Handle server errors
            res.status(500).json({ message: error.message, success: false });
        }
    }
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
exports.updateProject = [validateProjectCreation,
    async (req, res) => {
        try {
            const projectId = req.params.id;
            const updateData = req.body;
            const updateproject = await Project.findByIdAndUpdate(projectId, updateData, { new: true })
            if (!updateproject) {
                return res.status(404).json({ message: "Project Not Found" })
            }
            res.status(200).json({ message: "Project Update Successfully", success: true })
        } catch (error) {
            res.status(500).json({ message: error.message, succcess: false })
        }
    }];

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
