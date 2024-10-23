import mongoose from 'mongoose';

const individualTask = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    kanId: {
        type: String
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },
    taskName: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    dueDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['ToDo', 'In-Progress', 'On-Hold', 'Done'],
        default: 'ToDo'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Low'
    },
    assignees: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    report: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, { timestamps: true })

const IndividualTask = mongoose.model("Individual Tasks", individualTask);
export default IndividualTask;