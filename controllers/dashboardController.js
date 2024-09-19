import Dashboard from "../models/dashboard.js";

export const createDashboard = async (req, res) => {
    const { templateName, dashboardProject, owner } = req.body;

    if (!templateName || !dashboardProject || !owner) {
        return res.status(400).json({ message: "All fields are required", success: false });
    }

    try {
        await new Dashboard({
            templateName,
            dashboardProject,
            owner
        }).save();
        return res.status(201).json({ message: "Dashboard created successfully", success: true });
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong in server while creating dashboard.", success: false, error: err.message });
    }
}

export const getAllDashboard = async (req, res) => {
    try {
        const dashboards = await Dashboard.find().populate(["owner", "dashboardProject"]);
        return res.status(200).json({ message: "Dashboards fetched successfully.", success: true, dashboardData: dashboards });
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong in server while getting dashboard.", success: false, error: err.message });
    }
}

export const deleteDashboardById = async (req, res) => {
    const { id } = req.params;
    try {
        const dashboard = await Dashboard.findByIdAndDelete(id);
        if (!dashboard) {
            return res.status(404).json({ message: "Dashboard not found.", success: false });
        }
        return res.status(200).json({ message: "Dashboard deleted successfully.", success: true });
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong in server while deleting dashboard.", success: false, error: err.message });
    }
}