import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    teams: {
        type: mongoose.Schema.ObjectId,
        ref: "Team"
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    taskId: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Task",
            max: 100
        }
    ],
    sprintId: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Sprint"
        }
    ],
    timestamp: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["completed", "active", "inactive"],
        default: "inactive"
    },
    dueDate: { type: Date },
});

const Projects = mongoose.model("Project", ProjectSchema);

export default Projects;
