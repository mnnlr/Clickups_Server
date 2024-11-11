import Document from "../models/Document.js";
import Workspace from "../models/Workspace.js";
import { sendSuccessResponse, sendErrorResponse } from "./responseHelpers.js";

export const createDocument = async (req, res) => {
    try {
        const { documentTitle, documentContent, workspaceId, createdBy, contributors } = req.body;

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            return sendErrorResponse(res, 404, "Workspace not found.");
        }

        const newDocument = new Document({ documentTitle, documentContent, workspaceId, createdBy, contributors });
        await newDocument.save();

        workspace.workspaceDocuments.push(newDocument._id);
        await workspace.save();

        sendSuccessResponse(res, 201, "Document created and added to workspace successfully", newDocument);
    } catch (error) {
        sendErrorResponse(res, 500, "Error creating document.", error.message);
    }
};

export const getDocuments = async (req, res) => {
    try {
        const documents = await Document.find().populate("createdBy contributors");
        sendSuccessResponse(res, 200, "Documents retrieved successfully", documents);
    } catch (error) {
        sendErrorResponse(res, 500, "Error retrieving documents", error.message);
    }
};

export const getDocumentById = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await Document.findById(id).populate("createdBy contributors");
        if (!document) {
            return sendErrorResponse(res, 404, "Document not found");
        }
        sendSuccessResponse(res, 200, "Document retrieved successfully", document);
    } catch (error) {
        sendErrorResponse(res, 500, "Error retrieving document", error.message);
    }
};

export const updateDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const document = await Document.findByIdAndUpdate(id, updatedData, { new: true }).populate("createdBy contributors");
        if (!document) {
            return sendErrorResponse(res, 404, "Document not found");
        }
        sendSuccessResponse(res, 200, "Document updated successfully", document);
    } catch (error) {
        sendErrorResponse(res, 500, "Error updating document", error.message);
    }
};

export const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;

        const document = await Document.findById(id);
        if (!document) {
            return sendErrorResponse(res, 404, "Document not found");
        }

        await Workspace.findByIdAndUpdate(document.workspaceId, {
            $pull: { workspaceDocuments: id }
        });

        await Document.findByIdAndDelete(id);

        sendSuccessResponse(res, 200, "Document deleted successfully");
    } catch (error) {
        sendErrorResponse(res, 500, "Error deleting document", error.message);
    }
};
