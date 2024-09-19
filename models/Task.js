import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
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
    sprintId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sprint"
    },
    taskName: {
        type: String,
         required: true
    },
    description: {
        comment: {
            type: String
        },
        attachment: {
            type: String
        }
    },
    timestamp: {
        type: Date,
        default: Date.now
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

},{timestamps:true})

const Task = mongoose.model("Task", taskSchema);
export default Task;