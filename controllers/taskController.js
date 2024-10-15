import Comments from "../models/comment.js";
import Sprint from "../models/Sprint.js";
import Task from "../models/Task.js";
import User from "../models/UserModel.js";
import { TaskAssigned, getReporterSocketId, io } from "../Socket/Socket.js";
import { saveOfflineNotification } from "./notificationController.js";

const createTask = async (req, res) => {
  const { userId, taskName, description, assignees, report } = req.body;
  const { projectId, sprintId } = req.params;
  try {
    // Generating KAN-ID:-
    const allTask = await Task.find().exec();
    console.log("this is lastTask", allTask);
    let maxKanId = 0;

    allTask.forEach((task) => {
      const kanNumber = parseInt(task.kanId.split("-")[1], 10);
      if (kanNumber > maxKanId) {
        maxKanId = kanNumber;
      }
    });

    const kanId = `KAN-${maxKanId + 1}`;

    // Generating Due Data:-
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    const newTask = await Task.create({
      userId,
      kanId,
      projectId: projectId || undefined,
      sprintId: sprintId || undefined,
      taskName,
      description,
      dueDate,
      assignees: assignees || undefined,
      report: report || undefined,
    });

    // // for add the task into projectmodel
    // if (projectId) {
    //   const project = await Projects.findById(projectId);
    //   if (project) {
    //     if (project.taskId.length === 100) {
    //       return res
    //         .status(400)
    //         .json({
    //           status: false,
    //           message:
    //             "This project has reached the maximum number of tasks. Please create a new project.",
    //         });
    //     }
    //   }
    //   await Projects.findByIdAndUpdate(
    //     projectId,
    //     { $push: { taskId: newTask._id } },
    //     { new: true }
    //   );
    // }

    if (sprintId) {
      await Sprint.findByIdAndUpdate(
        sprintId,
        { $push: { taskIds: newTask._id } },
        { new: true }
      );
    }

    const assigneesArray = Array.isArray(assignees) ? assignees : [assignees];

    const assigneeSocketIds = TaskAssigned(assigneesArray);
    const user = await User.findById(userId);
    assigneeSocketIds.forEach(async (socketId, index) => {
      const assigneeId = assigneesArray[index];
      // console.log("Assigned ID",assigneeId);

      if (assigneeId.toString() === user._id.toString()) {
        await saveOfflineNotification({ _id: assigneeId, user }, newTask._id, `A new task "${taskName}" created by me ${kanId}.`);
        return;
      }

      if (socketId) {
        io.to(socketId).emit('notification', {
          message: `A new task "${taskName}" has been assigned to you by ${user.name}.`,
          task: newTask,
        });
        // await saveOfflineNotification({ _id: assigneeId, name: user.name }, newTask._id, `A new task "${taskName}" has been assigned to you by ${user.name} and Task Number is ${kanId}.`);
      } else {
        await saveOfflineNotification({ _id: assigneeId, name: user.name }, newTask._id, `A new task "${taskName}" has been assigned to you by ${user.name} and Task Number is ${kanId}.`);
      }
    });

    // for add the task into sprint model
    res.status(201).json({
      status: "success",
      data: {
        task: newTask,
      },
    });

  } catch (err) {
    res.status(400).json({ status: "false", message: err.message });
  }
};

const updateTaskById = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        status: "false",
        message: "No update fields provided",
      });
    }

    // Find the task by ID, populate the reporter and assignee info
    const task = await Task.findById(id)

    if (!task) {
      return res.status(404).json({
        status: "false",
        message: "Task not found",
      });
    }

    // Update the task with the provided updates
    const updatedTask = await Task.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate("assignees", "name email _id").populate("report", "name email _id");

    // Notify the reporter that the task has been updated
    const reporter = task.report;
    if (!reporter) {
      return res.status(400).json({ message: "Please select an Reporter for the task." });
    }

    // Extract assignee names and construct the message
    const assigneeNames = updatedTask.assignees.name;

    const message = `The task "${updatedTask.taskName}" has been updated by ${assigneeNames}.`;

    // Use getReporterSocketId to check if the reporter is online
    const reporterSocketId = getReporterSocketId(reporter._id);


    if (reporterSocketId) {
      io.to(reporterSocketId).emit("taskUpdated", {
        message,
        taskId: updatedTask._id,
        taskTitle: updatedTask.taskName,
      });
      // await saveOfflineNotification(reporter._id, updatedTask._id, message);
    } else {
      await saveOfflineNotification(reporter._id, updatedTask._id, message);
    }

    res.status(200).json({
      status: "true",
      data: {
        task: updatedTask,
      },
    });

  } catch (err) {
    console.error("Error updating task:", err.message);
    res.status(400).json({ status: "false", message: err.message });
  }
};

const showAllTasks = async (req, res) => {
  try {
    const allTask = await Task.find()
      .populate("sprintId", "endDate")
      .populate("userId", "name");

    res.status(200).json({
      status: "success",
      result: allTask.length,
      data: {
        allTask,
      },
    });
  } catch (err) {
    res.status(400).json({ status: "false", message: err.message });
  }
};


const deleteTaskById = async (req, res) => {
  const { id } = req.params;
  try {
    // Find and delete the task
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({
        status: false,
        message: "Task not found",
      });
    }
   // console.log("Deleted Task:", deletedTask);
    // Delete associated comments
    try {
      await Comments.deleteMany({ taskId: id });
     // console.log(`Comments associated with task ${id} deleted.`);
    } catch (commentErr) {
     // console.error("Error deleting comments:", commentErr.message);
      return res.status(500).json({
        status: false,
        message: `Failed to delete comments for task ${id}`,
      });
    }

    // If task is associated with a project, remove it from the project
    // if (deletedTask.projectId) {
    //   try {
    //     await Projects.findByIdAndUpdate(
    //       deletedTask.projectId,
    //       { $pull: { taskId: deletedTask._id } },
    //       { new: true }
    //     );
    //     console.log(`Task ${id} removed from project ${deletedTask.projectId}.`);
    //   } catch (projectErr) {
    //     console.error("Error updating project:", projectErr.message);
    //     return res.status(500).json({
    //       status: false,
    //       message: `Failed to remove task ${id} from project`,
    //     });
    //   }
    // }

    // If task is associated with a sprint, remove it from the sprint
    if (deletedTask.sprintId) {
      try {
        await Sprint.findByIdAndUpdate(
          deletedTask.sprintId,
          { $pull: { taskIds: deletedTask._id } },
          { new: true }
        );
        //console.log(`Task ${id} removed from sprint ${deletedTask.sprintId}.`);
      } catch (sprintErr) {
       // console.error("Error updating sprint:", sprintErr.message);
        return res.status(500).json({
          status: false,
          message: `Failed to remove task ${id} from sprint`,
        });
      }
    }

    res.status(200).json({
      status: "success",
      message: "Task and associated comments deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting task:", err.message);
    res.status(500).json({ status: "false", message: err.message });
  }
};

const GetassignedTask = async (req, res) => {
  const { assignees } = req.params;

  const getAssignedTask = await Task.find({ assignees }).sort({ createdAt: -1 }).limit(4);
  //console.log(getAssignedTask);

  if (!getAssignedTask) {
    return res.status(404).json({ message: "Task not found", success: false })
  }
  res.status(200).json({ message: "Task found", success: true, data: getAssignedTask })
}

const GetCreatedTask = async (req, res) => {
  const { userId } = req.params;

  const getTask = await Task.find({ userId }).sort({ createdAt: -1 }).limit(4);

  if (!getTask) {
    return res.status(404).json({ message: "Task not found", success: false })
  }
  res.status(200).json({ message: "Task found", success: true, data: getTask })

}
export { createTask, showAllTasks, updateTaskById, deleteTaskById, GetCreatedTask, GetassignedTask };
