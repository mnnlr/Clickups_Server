import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    teams: [
        {
            id: { type: mongoose.Schema.ObjectId, ref: "Team" }, //? discus the User ref, here should be team ref
        },
    ],
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
        enum: ["active", "inactive"],
        default: "inactive"
    },
    duedate: { type: Date },
});

const Projects = mongoose.model("Project", ProjectSchema);

export default Projects;
