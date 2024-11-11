import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    documentTitle: {
        type: String,
        require: true
    },
    documentContent: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    contributors: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

const Document = mongoose.model("Document", documentSchema);

export default Document;