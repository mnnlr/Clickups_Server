import { Router } from "express";
import {
  getTasksByProjectId,
  individualTaskCreate,
  individualTaskDelete,
  individualTaskUpdate,
} from "../controllers/IndividualTaskController.js";
import isAuthenticated from "../middleware/Authenticated.js";

const IndividualTaskRoute = Router();

IndividualTaskRoute.post('/:projectId/create',isAuthenticated, individualTaskCreate);

IndividualTaskRoute
  .route('/:id')
  .patch(individualTaskUpdate,isAuthenticated)
  .delete(individualTaskDelete,isAuthenticated)
  IndividualTaskRoute.get('/:projectId/Tasks',getTasksByProjectId)

export default IndividualTaskRoute;
