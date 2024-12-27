import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    documentTitle: {
        type: String,
        require: true
    },
    documentContent_cloudinaryURL: {
        type: String
    },
    documentContent_cloudinaryPublicId: {
        type: String
    },
    // For all the members.
    permissions: {
        canEdit: {
            type: Boolean,
            default: false
        },
        canView: {
            type: Boolean,
            default: true
        }
    },
    workspaceId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Workspace',
        required: true
    },
    contributors: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
}, { timestamps: true });

const Document = mongoose.model("Document", documentSchema);

export default Document;