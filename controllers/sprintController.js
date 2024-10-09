import Sprint from '../models/Sprint.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import { sprintNotification } from './notificationController.js';
import { io, sprintNotify } from '../Socket/Socket.js';


const createSprint = async (req, res) => {
    const { taskIds = [], sprintname, startDate, endDate } = req.body;
    const { projectId } = req.params;

    try {
        if (!Array.isArray(taskIds)) {
            return res.status(400).json({ message: 'taskIds should be an array' });
        }

        const tasks = await Task.find({ _id: { $in: taskIds } });
        if (tasks.length !== taskIds.length) {
            return res.status(404).json({ message: 'One or more tasks not found' });
        }

        // Validate sprint dates
        const sprintStartDate = new Date(startDate);
        let sprintEndDate = new Date(endDate);

        if (!endDate) {
            // If no end date is provided, set the end date to one month from the start date
            sprintEndDate = new Date(sprintStartDate);
            sprintEndDate.setMonth(sprintEndDate.getMonth() + 1); // Sprint valid for one month
        }

        // Ensure sprint does not exceed the one-month period
        const maxEndDate = new Date(sprintStartDate);
        maxEndDate.setMonth(maxEndDate.getMonth() + 1); // One month from the start date

        if (sprintEndDate > maxEndDate) {
            return res.status(400).json({ message: 'Sprint end date cannot be more than one month from the start date.' });
        }

        // Find the project by ID and populate team members
        const isProject = await Project.findById(projectId)
            .select('projectName teams sprintId taskIds')
            .populate('teams', 'members');

        if (!isProject) return res.status(404).json({ message: 'Project not found' });

        const newSprint = new Sprint({
            projectId,
            sprintname,
            taskIds,
            startDate: sprintStartDate,
            endDate: sprintEndDate
        });

        await newSprint.save();

        if (!Array.isArray(isProject.sprintId)) {
            isProject.sprintId = [];
        }
        isProject.sprintId.push(newSprint._id);
        await isProject.save();

        // Get the array of team members (flattening if there are multiple teams)
        const teamMembers = isProject.teams.flatMap(team => team.members);

        // Send notification to each team member via their socket or save it if they are offline
        const teamSocketIds = sprintNotify(teamMembers);

        for (const member of teamMembers) {
            const socketId = teamSocketIds[member._id];

            const message = `A new sprint "${sprintname}" has been created in the project "${isProject.projectName}".`;

            // If the user is online, send the notification via their socket
            if (socketId) {
                io.to(socketId).emit('sprintCreated', {
                    message,
                    sprint: newSprint,
                });
                await sprintNotification(member._id, newSprint._id, message);
            } else {
                // If the user is offline, save the notification in the database
                await sprintNotification(member._id, newSprint._id, message);
            }
        }

        // Return success response
        return res.status(201).json({ message: "Sprint created successfully", success: true, Data: newSprint });
    } catch (err) {
        console.error("Error creating sprint:", err.message); // Log error for debugging
        return res.status(500).json({ message: err.message });
    }
};




const updateSprint = async (req, res) => {
    const { sprintId } = req.params;
    const { taskIds = [], sprintname, startDate, endDate } = req.body; // Default taskIds to an empty array

    try {
        if (taskIds && !Array.isArray(taskIds)) {
            return res.status(400).json({ message: 'taskIds should be an array' });
        }

        const sprint = await Sprint.findById(sprintId);
        if (!sprint) return res.status(404).json({ message: 'Sprint not found' });

        // Update sprint properties
        if (sprintname) sprint.sprintname = sprintname;
        if (startDate) sprint.startDate = startDate;
        if (endDate) sprint.endDate = endDate;

        // Use $addToSet to add taskIds without duplicates
        if (taskIds.length > 0) {
            const tasks = await Task.find({ _id: { $in: taskIds } });
            if (tasks.length !== taskIds.length) {
                return res.status(404).json({ message: 'One or more tasks not found' });
            }

            await Sprint.updateOne(
                { _id: sprintId },
                { $addToSet: { taskIds: { $each: taskIds } } }
            );
        }

        // Save the updated sprint
        await sprint.save();

        res.status(200).json({ message: 'Sprint updated successfully', success: true, data: sprint });
    } catch (error) {
        res.status(500).json({ message: error.message });
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

const getSprintById = async (req, res) => {
    try {
        const sprint = await Sprint.findById(req.params.projectId);
        if (!sprint) return res.status(404).json({ status: 'error', message: 'Sprint not found' });
        res.status(200).json({ status: 'success', data: sprint });
    } catch (err) {
        res.status(400).json({ status: 'error', message: err.message });
    }
};

const deleteSprintById = async (req, res) => {
    const { sprintId } = req.params;
    try {
        // Find the sprint to be deleted
        const sprint = await Sprint.findById(sprintId);

        if (!sprint) {
            return res.status(404).json({
                status: false,
                message: "Sprint not found",
            });
        }

        // Delete all tasks associated with the sprint
        await Task.deleteMany({ sprintId: sprint._id });

        // Remove the sprint reference from the associated project
        if (sprint.projectId) {
            await Project.findByIdAndUpdate(
                sprint.projectId,
                { $pull: { sprintId: sprint._id } },
                { new: true }
            );
        }

        // Finally, delete the sprint itself
        await Sprint.findByIdAndDelete(sprint._id);

        res.status(200).json({
            status: "success",
            message: "Sprint and associated tasks deleted successfully",
        });
    } catch (err) {
        res.status(400).json({ status: "false", message: err.message });
    }
};

const getSprintsByProjectId = async (req, res) => {
    const { projectId } = req.params;
    //console.log(`Fetching sprints for projectId: ${projectId}`);

    try {
        const project = await Project.findById(projectId);
        if (!project) {
            console.log('Project not found');
            return res.status(404).json({ message: 'Project not found' });
        }

        const sprints = await Sprint.find({ projectId })
            .populate({
                path: 'taskIds',
                model: 'Task',
                populate: {
                    path: 'userId',
                    select: 'name'
                }
            })
            .exec();

        console.log('Sprints fetched:', sprints);
        return res.status(200).json({ message: "Sprints fetched successfully", Data: sprints });
    } catch (err) {
        console.error('Error fetching sprints:', err);
        res.status(500).json({ message: err.message });
    }
};

const GetTasksBySprintId = async (req, res) => {
    try {
        const { sprintId } = req.params; // Extract sprintId from route params

        // Fetch the sprint by ID
        const sprint = await Sprint.findById(sprintId); // Populate might be unnecessary if taskIds is an array of IDs

        if (!sprint) {
            return res.status(404).json({ message: "Sprint not found.", success: false });
        }

        // Fetch tasks based on the taskIds from the sprint
        const tasks = await Task.find({ _id: { $in: sprint.taskIds } });

        return res.status(200).json({ message: "Tasks fetched successfully", success: true, data: tasks });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
};

export {
    createSprint, updateSprint, getSprintsByProjectId, GetTasksBySprintId,
    getSprints,
    getSprintById,
    deleteSprintById
};
