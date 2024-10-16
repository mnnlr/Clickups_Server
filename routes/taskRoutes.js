import express from "express";
import {
  showAllTasks,
  createTask,
  deleteTaskById,
  updateTaskById,
  GetassignedTask,
  GetCreatedTask,
  individualTask,

} from "../controllers/taskController.js";
import Authenticated from "../middleware/Authenticated.js";

const taskRoutes = express.Router();
taskRoutes.post('/individual', individualTask)
taskRoutes.get("/", Authenticated, showAllTasks);
taskRoutes.post("/:projectId/:sprintId", Authenticated, createTask);
taskRoutes.get('/:assignees', GetassignedTask)
taskRoutes.get('/:userId/task', GetCreatedTask)
taskRoutes
  .route("/:id")
  .patch(Authenticated, Authenticated, updateTaskById)
  .delete(Authenticated, deleteTaskById);

export default taskRoutes;
