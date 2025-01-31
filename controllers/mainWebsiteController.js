import Projects from "../models/Project.js";
import Task from "../models/Task.js";
import Workspace from "../models/Workspace.js";
import IndividualTask from "../models/individualTask.js";
import Document from "../models/Document.js";

export const getWorkspaceData = async (req, res) => {
  try {
    const today = new Date(); // Current date (e.g., 21 Feb 2025)
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // 1st Feb 2025


    const projects = await Projects.find({}).populate('teams.teamIDs').populate('teams.memberIDs').populate('owner').populate('sprintId').populate('individualtaskId');
    const tasks = await Task.find({}).populate('userId').populate('projectId').populate('sprintId').populate('assignees').populate("report");
    const workspaces = await Workspace.find({}).populate('workspaceDocuments').populate('workspaceMembers').populate('workspaceCreatedBy');
    const individualTasks = await IndividualTask.find({}).populate('userId').populate('projectId').populate('assignees').populate("report");
    const documents = await Document.find({}).populate('permissions').populate('workspaceId').populate('contributors').populate('createdBy');

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
