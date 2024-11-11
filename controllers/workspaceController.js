import Workspace from "../models/Workspace.js";
import UserModel from "../models/UserModel.js"
import { sendSuccessResponse, sendErrorResponse } from "./responseHelpers.js"

// controllers
export const getAllWorkspace = async (req, res) => {
    try {
        const workspaceData = await Workspace.find().populate("workspaceDocuments workspaceMembers workspaceCreatedBy");
        if (workspaceData) return sendSuccessResponse(res, 200, "Data in database.", workspaceData);
    } catch (err) {
        return sendErrorResponse(res, 500, "Error in server while getting workspace data (controller: getAllWorkspace).", err);
    }
}

export const getWorkspaceById = async (req, res) => {
    const { id } = req.body;

    try {
        const workspaceData = await Workspace.findById(id).populate("workspaceDocuments workspaceMembers workspaceCreatedBy");
        if (workspaceData) return sendSuccessResponse(res, 200, "Data in database.", workspaceData);
    } catch (err) {
        return sendErrorResponse(res, 500, "Error in server while getting workspace data (controller: getAllWorkspace).", err);
    }
}

export const handleCreateWorkspace = async (req, res) => {
    const { workspaceName, workspaceCreatedBy } = req.body;

    if (!workspaceName || !workspaceCreatedBy) return sendErrorResponse(res, 400, "Workspace name or created by is not provided.");

    try {
        const createWorkspace = await Workspace.create({ workspaceName, workspaceCreatedBy });

        if (!createWorkspace) return sendErrorResponse(res, 500, "Error while creating workspace (controller: handleCreateWorkspce).");

        return sendSuccessResponse(res, 201, "Workspace created successfully in database.", createWorkspace);
    } catch (err) {
        return sendErrorResponse(res, 500, "Error in server while creating workspace (controller: handleCreateWorkspce).", err);
    }
}

export const handleUpdateWorkspace = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    if (!id) return sendErrorResponse(res, 400, "Workspace Id is not provided (controller: handleUpdateWorkspace).");
    if (!updatedData) return sendErrorResponse(res, 400, "No data is provided to update (controller: handleUpdateWorkspace).");
    const members = updatedData.workspaceMembers;

    try {
        if (members) {
            // Check duplicate data is present or not.
            const uniqueMembers = new Set(members); // set removes the duplicate data
            console.log(uniqueMembers);
            if (uniqueMembers.size !== members.length) { // if duplicate data found then return error
                return sendErrorResponse(res, 400, "Duplicate member IDs found in workspaceMembers (controller: handleUpdateWorkspace).");
            }

            for (let memberId of members) {
                if (memberId) {
                    const member = await UserModel.findById(memberId);
                    if (!member) {
                        return sendErrorResponse(res, 400, `The user with id: ${memberId} is not present in database (controller: handleUpdateWorkspace).`);
                    }
                    const workspaceMember = await Workspace.findOne({ workspaceMembers: memberId });
                    if (workspaceMember) {
                        return sendErrorResponse(res, 400, `The user with id: ${memberId} is alrady in the workspace: ${id}.`);
                    }
                }
            }
        }
        const updatedWorkspace = await Workspace.findByIdAndUpdate(id, { $set: updatedData }, { new: true, runValidators: true }).populate("workspaceDocuments workspaceMembers workspaceCreatedBy");
        if (!updatedWorkspace) return sendErrorResponse(res, 404, `Workspace with id: ${id} is not present in database (controller: handleUpdateWorkspace).`);
        return sendSuccessResponse(res, 200, `Workspace with id: ${id} is updated.`, updatedWorkspace);
    } catch (err) {
        return sendErrorResponse(res, 500, "Error in server while updating workspace (controller: handleUpdateWorkspace).", err);
    }
}

export const handleDeleteWorkspace = async (req, res) => {
    const { id } = req.params;

    if (!id) return sendErrorResponse(res, 400, "Workspace Id is not provided (controller: handleDeleteWorkspace).");

    try {
        const deletedWorkspace = await Workspace.findByIdAndDelete(id);
        if (!deletedWorkspace) return sendErrorResponse(res, 404, `Workspace with id: ${id} is not present in database (controller: handleDeleteWorkspace).`);
        return sendSuccessResponse(res, 200, `Workspace with id: ${id} is deleted.`, deletedWorkspace);
    } catch (err) {
        return sendErrorResponse(res, 500, "Error in server while deleting workspace (controller: handleDeleteWorkspace).", err);
    }
}