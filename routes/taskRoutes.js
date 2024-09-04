import express from "express";
import {
  showAllTasks,
  createTask,
  deleteTaskById,
  updateTaskById,
} from "../controllers/taskController.js";
import Authenticated from "../middleware/Authenticated.js";

const taskRoutes = express.Router();

taskRoutes
  .route("/")
  .get(Authenticated, showAllTasks)
  .post(Authenticated, createTask);

taskRoutes
  .route("/:id")
  .patch(Authenticated, updateTaskById)
  .delete(Authenticated, deleteTaskById);

export default taskRoutes;
