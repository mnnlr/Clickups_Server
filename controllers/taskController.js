const Task = require("../models/Task.js");

const createTask = async (req, res) => {
  const { userId, taskName, projectId, description, assignees, report } = req.body;
  try {
    // Generating KAN-ID:-
    const lastTask = await Task.findOne().sort({ kanId: -1 }).exec();

    let kanId;
    if (lastTask && lastTask.kanId) {
      const lastKanNumber = parseInt(lastTask.kanId.split("-")[1], 10);

      kanId = `KAN-${lastKanNumber + 1}`;
    } else {
      kanId = "KAN-1";
    }

    // Generating Due Data:-
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    const newTask = await Task.create({
      userId,
      kanId,
      projectId: projectId || undefined,
      taskName,
      description,
      dueDate,
      assignees: assignees || undefined,
      report: report || undefined,
    });
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

module.exports = {
  createTask,
  showAllTasks,
  updateTaskById,
  deleteTaskById,
};
