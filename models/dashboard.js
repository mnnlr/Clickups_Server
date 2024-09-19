import mongoose from "mongoose";

const dashboardSchema = new mongoose.Schema({
    templateName: {
        type: String,
        required: true
    },
    dashboardProject: {
        type: mongoose.Schema.ObjectId,
        ref: "Project",
        required: true
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

const Dashboard = mongoose.model("Dashboard", dashboardSchema);
export default Dashboard;