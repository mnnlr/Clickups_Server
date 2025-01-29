import Projects from "../models/Project.js";
import Task from "../models/Task.js";
import Workspace from "../models/Workspace.js";
import IndividualTask from "../models/individualTask.js";
import Document from "../models/Document.js";

export const getWorkspaceData = async (req, res) => {
    try {
        const today = new Date(); // Current date (e.g., 21 Feb 2025)
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // 1st Feb 2025

        // Fetch data from all models within the date range
        const projects = await Projects.find({
            createdAt: { $gte: startOfMonth, $lte: today },
        });
        const tasks = await Task.find({
            createdAt: { $gte: startOfMonth, $lte: today },
        });
        const workspaces = await Workspace.find({
            createdAt: { $gte: startOfMonth, $lte: today },
        });
        const individualTasks = await IndividualTask.find({
            createdAt: { $gte: startOfMonth, $lte: today },
        });
        const documents = await Document.find({
            createdAt: { $gte: startOfMonth, $lte: today },
        });

        // Structure the data
        const workspaceData = {
            projects: {
                count: projects.length,
                items: projects,
            },
            tasks: {
                count: tasks.length,
                items: tasks,
            },
            workspaces: {
                count: workspaces.length,
                items: workspaces,
            },
            individualTasks: {
                count: individualTasks.length,
                items: individualTasks,
            },
            documents: {
                count: documents.length,
                items: documents,
            },
        };

        res.status(200).json(workspaceData);
    } catch (error) {
        console.error("Error fetching workspace data:", error);
        res.status(500).json({ message: "Failed to fetch workspace data" });
    }
};
