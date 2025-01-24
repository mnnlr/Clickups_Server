import IndividualTask from "../models/individualTask.js";
import Projects from '../models/Project.js'

// Create an individual task
const individualTaskCreate = async (req, res) => {
    try {
        const { taskName, description, assignees,status, report, userId } = req.body;
        const { projectId } = req.params;

        // Log task details
        if (description) {
            console.log("this is body------------------------>", taskName, description, assignees, report, userId);
        } else {
            console.log("body is empty or null");
        }

        // Generate KAN-ID
        const allTasks = await IndividualTask.find().exec();
        let maxKanId = 0;

        allTasks.forEach((task) => {
            const kanNumber = parseInt(task.kanId.split("-")[1], 10);
            if (kanNumber > maxKanId) {
                maxKanId = kanNumber;
            }
        });

        const kanId = `KAN-${maxKanId + 1}`;

        // Generate Due Date
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7);

        // Create new task
        const newTask = await IndividualTask.create({
            userId,
            kanId,
            taskName,
            description,
            status:status || 'ToDo',
            dueDate,
            assignees: assignees || undefined,
            report: report || undefined,
            projectId: projectId || undefined
        });

        // Add the task to the specified project
        if (projectId) {
            const project = await Projects.findById(projectId);
            if (project) {
                // Check if taskId is defined and is an array
                if (!project.individualtaskId || !Array.isArray(project.individualtaskId)) {
                    project.individualtaskId = [];
                }

                if (project.individualtaskId.length >= 100) {
                    return res.status(400).json({
                        success: false,
                        message: "This project has reached the maximum number of tasks. Please create a new project.",
                    });
                }

                // Add the task ID to the project's task list
                await Projects.findByIdAndUpdate(
                    projectId,
                    { $push: { individualtaskId: newTask._id } },
                    { new: true }
                );
            }
        }

        console.log("New Task:", newTask);

        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: { task: newTask },
        });
    } catch (err) {
        console.error("Error creating individual task:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};

// Update an individual task
const individualTaskUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedTask = await IndividualTask.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedTask) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Task updated successfully",
            data: { task: updatedTask },
        });
    } catch (err) {
        console.error("Error updating individual task:", err.message);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// Delete an individual task
const individualTaskDelete = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedTask = await IndividualTask.findByIdAndDelete(id);

        if (!deletedTask) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        // Remove the task ID from the associated project
        if (deletedTask.projectId) {
            await Projects.findByIdAndUpdate(
                deletedTask.projectId,
                { $pull: { individualtaskId: deletedTask._id } },
                { new: true }
            );
        }

        return res.status(200).json({
            success: true,
            message: "Task deleted successfully",
        });
    } catch (err) {
        console.error("Error deleting individual task:", err.message);
        return res.status(500).json({ success: false, message: err.message });
    }
};


const getTasksByProjectId = async (req, res) => {
    try {
        const { projectId } = req.params;

        // Find tasks associated with the specified project ID
        const tasks = await IndividualTask.find({ projectId })
            .populate("userId", "name")
            .populate('assignees', 'name')
            .populate('report', 'name')


        if (!tasks.length) {
            return res.status(404).json({
                message: "No tasks found for this project.",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Tasks fetched successfully",
            success: true,
            data: tasks, // Include the fetched tasks in the response
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
    
    const GetIndividualTasksById=async(req,res)=>{
        try{        
        const {id}=req.params;

        if(!id){
            return res.status(401).json({success:false ,message:"User Id Is Not Present"})
        }

        const UserIndividualTasks=await IndividualTask.find({assignees:id})
        .populate("userId","name")
        .populate("assignees","name");
        return res.status(200).json({success:true, message:"tasks Find Successfully",data:UserIndividualTasks})
        }catch(error){
            console.log(error)
        }
    }

    const GetIndividualCreatedTaskById=async(req,res)=>{
        try{
                const {userId}=req.params;

                if(!userId){
                    return res.status(401).json({success:false,message:"User Id Not Provided"});
                }

                const CreatedIndividualtasks=await IndividualTask.find({userId})
                .populate("userId","name")
                .populate("assignees","name")

                return res.status(200).json({success:true,messaage:"tasks fetch Successfully",data:CreatedIndividualtasks})

            }catch(error){
                console.log(error)
            }
        }
    

export { individualTaskCreate, individualTaskUpdate, individualTaskDelete, getTasksByProjectId,GetIndividualTasksById,GetIndividualCreatedTaskById };
