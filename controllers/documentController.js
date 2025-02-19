import Document from "../models/Document.js";
import Workspace from "../models/Workspace.js";
import { sendSuccessResponse, sendErrorResponse } from "./responseHelpers.js";

export const createDocument = async (req, res) => {
    try {
        const { documentTitle, createdBy, workspaceId, permissions,PermissionForAll } = req.body;
        if (!documentTitle || !createdBy || !workspaceId) {
            return sendErrorResponse(res, 404, "DocumentTitle, CreatedBy and workspaceId is not provided.");
        }

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) return sendErrorResponse(res, 404, `Workspace with id: ${workspaceId} not found.`);
        const PermissionsFor = permissions.map((permissions) => ({
            user: permissions._id,
            canEdit: permissions.canEdit || false,
            canView: permissions.canView || true,
        }));
        const newDocument = new Document({ documentTitle, createdBy, permissions:PermissionsFor, PermissionForAll,workspaceId });
        await newDocument.save();
        const populatedDoc = await Document.findById(newDocument._id).populate("createdBy")

        workspace.workspaceDocuments.push(newDocument._id);
        await workspace.save();

        sendSuccessResponse(res, 201, `Document with id: ${newDocument._id} created and added to workspace with id: {workspaceId} successfully`, populatedDoc);
    } catch (error) {
        console.log("error........",error)
        sendErrorResponse(res, 500, "Error creating document.", error.message);
    }
};

export const getDocuments = async (req, res) => {
    try {
        const documents = await Document.find().populate("createdBy contributors permissions.user");
        console.log('documents...',documents)
        sendSuccessResponse(res, 200, "Documents retrieved successfully", documents);
    } catch (error) {
        sendErrorResponse(res, 500, "Error retrieving documents", error.message);
    }
};

export const getDocumentById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return sendErrorResponse(res, 404, "Id didn't provided.");
        const document = await Document.findById(id).populate("createdBy contributors permissions.user");
        if (!document) {
            return sendErrorResponse(res, 404, `document with id: ${id} not found.`);
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
        const document = await Document.findByIdAndUpdate(id, { $set: updatedData }, { new: true }).populate("createdBy contributors");
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

        console.log("id: ", id);
        if (!id) return sendErrorResponse(res, 404, "Document id didn't provided.");

        const document = await Document.findById(id);
        if (!document) return sendErrorResponse(res, 404, `Document with id: ${id} not found.`);

        const workspaceId = document.workspaceId;
        console.log("workspaceid: ", workspaceId);

        await Workspace.findByIdAndUpdate(workspaceId, {
            $pull: { workspaceDocuments: id }
        });

        await Document.findByIdAndDelete(id);

        sendSuccessResponse(res, 200, `Document with id: ${id} deleted successfully`);
    } catch (error) {
        sendErrorResponse(res, 500, "Error deleting document", error.message);
    }
};

export const updateDocumentPermissions = async (req, res) => {
    try {
        const { id } = req.params;
        const { Members,PermissionForAll } = req.body;
        // Validate request input
        if (!id || !Members) {
            return sendErrorResponse(res, 400, 'Document ID or Members data not provided');
        }
        // Map permissions for update
        const PermissionsFor = Members.map((permissions) => ({
            user: permissions.user._id,
            canEdit: permissions.canEdit,
            canView: permissions.canView
        }));
        console.log('PermissionsFor',PermissionForAll)
        // Update document permissions
        const updatedDocument = await Document.findByIdAndUpdate(
            id,
            { $set: { permissions: PermissionsFor ,PermissionForAll:PermissionForAll} }, // Replace the permissions array
            { new: true, runValidators: true } // Return updated document and validate schema
        ).populate('createdBy'); // Populate referenced fields

        // Handle non-existing document
        if (!updatedDocument) {
            return sendErrorResponse(res, 404, 'Document not found');
        }

        // Send success response
        return sendSuccessResponse(res, 200, 'Permissions updated successfully', updatedDocument);
    } catch (error) {
        console.error('Error updating document permissions:', error);

        // Handle specific validation errors
        if (error.name === 'ValidationError') {
            return sendErrorResponse(res, 400, `Validation Error: ${error.message}`);
        }

        // Handle invalid ObjectId errors
        if (error.kind === 'ObjectId') {
            return sendErrorResponse(res, 400, 'Invalid Document ID');
        }

        // Handle general errors
        return sendErrorResponse(res, 500, 'Error updating document permissions');
    }
};
