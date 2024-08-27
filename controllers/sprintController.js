const Sprint = require('../models/Sprint')
const Project = require('../models/Project')
const Task = require('../models/Task')

const createSprint = async (req, res) => {
    const {projectId, task, startDate, endDate} = req.body
    try{
       const isTask = await Task.findById(task)
     if(!isTask) return res.status(404).json({message: 'Task not found'})
       const isProject = await Project.findById(projectId)
       if(!isProject) return res.status(404).json({message: 'Project not found'})
       const newSprint = new Sprint({
        projectId,
        task,
        startDate,
        endDate
       })
       await newSprint.save()
       return res.status(201).json(newSprint)
    }catch(err){
        res.status(500).json({message: err.message})
    }
}

module.exports = {
    createSprint
}