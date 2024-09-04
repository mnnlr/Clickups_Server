import Sprint from '../models/Sprint.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';


const createSprint = async (req, res) => {
    const { projectId, task, startDate, endDate } = req.body;
    try {
        const isTask = await Task.findById(task);
        if (!isTask) return res.status(404).json({ message: 'Task not found' });

        const isProject = await Project.findById(projectId);
        if (!isProject) return res.status(404).json({ message: 'Project not found' });

        const newSprint = new Sprint({
            projectId,
            task,
            startDate,
            endDate
        });
        await newSprint.save();
        
isProject.sprintId.push(newSprint._id);
        await isProject.save()

        return res.status(201).json({ message: "Sprint created successfully", succcess: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const getSprints = async (req, res) => {
    try {
        const sprints = await Sprint.find();
        return res.status(200).json({ message: "Sprint get successfully", Data: sprints });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



const deleteSprint = async (req, res) => {
    const { sprintId } = req.params; 
    try {
        const isSprint = await Sprint.findById(sprintId);
        if (!isSprint) return res.status(404).json({ message: 'Sprint not found' });

        const deletedSprint = await Sprint.findByIdAndDelete(sprintId);
        res.status(200).json({ message: 'Sprint deleted successfully', succcess: true});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    createSprint,
    getSprints,
    deleteSprint
};
