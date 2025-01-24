import { Router } from "express";
import {
  getTasksByProjectId,
  individualTaskCreate,
  individualTaskDelete,
  individualTaskUpdate,
  GetIndividualTasksById,
  GetIndividualCreatedTaskById,
} from "../controllers/IndividualTaskController.js";
import isAuthenticated from "../middleware/Authenticated.js";

const IndividualTaskRoute = Router();

IndividualTaskRoute.post('/:projectId/create', isAuthenticated, individualTaskCreate);

IndividualTaskRoute
  .route('/:id')
  .patch(individualTaskUpdate, isAuthenticated)
  .delete(individualTaskDelete, isAuthenticated)
  .get(GetIndividualTasksById, isAuthenticated)

IndividualTaskRoute.get('/:projectId/Tasks', getTasksByProjectId,isAuthenticated)

IndividualTaskRoute.get('/:userId/getcreatedIndividualtasks',GetIndividualCreatedTaskById,isAuthenticated)

export default IndividualTaskRoute;
