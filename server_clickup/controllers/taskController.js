import Projects from "../models/Project.js";
import Sprint from "../models/Sprint.js";
import Task from "../models/Task.js";

const createTask = async (req, res) => {
  const { userId, taskName, description, assignees, report } = req.body;
  const { projectId, sprintId } = req.params;
  try {
    // Generating KAN-ID:-
    const allTask = await Task.find().exec();
    // console.log("this is lastTask", allTask);
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

    // for add the task into projectmodel
    if (projectId) {
      const project = await Projects.findById(projectId);
      if (project) {
        if (project.taskId.length === 100) {
          return res
            .status(400)
            .json({
              status: false,
              message:
                "This project has reached the maximum number of tasks. Please create a new project.",
            });
        }
      }
      await Projects.findByIdAndUpdate(
        projectId,
        { $push: { taskId: newTask._id } },
        { new: true }
      );
    }

    if (sprintId) {
      await Sprint.findByIdAndUpdate(
        sprintId,
        { $push: { taskIds: newTask._id } },
        { new: true }
      );
    }

    // for add the task into sprint model
    res.status(201).json({
      status: "sucess",
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
    const updatedTask = await Task.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!updatedTask) {
      return res.status(404).json({
        status: "false",
        message: "Task not found",
      });
    }
    res.status(200).json({
      status: "true",
      data: {
        task: updatedTask,
      },
    });
  } catch (err) {
    res.status(400).json({ status: "false", message: err.message });
  }
};

const showAllTasks = async (req, res) => {
  try {
    const allTask = await Task.find();
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
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({
        status: false,
        message: "Task not found",
      });
    }
    res
      .status(200)
      .json({ status: "success", message: "task deleted Succefully" });
  } catch (err) {
    res.status(400).json({ status: "false", message: err.message });
  }
};

export { createTask, showAllTasks, updateTaskById, deleteTaskById };
