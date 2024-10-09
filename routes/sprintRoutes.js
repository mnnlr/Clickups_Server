import express from 'express';
const sprintRouter = express.Router();

import  { getSprints, createSprint, updateSprint, getSprintsByProjectId, deleteSprintById, GetTasksBySprintId} from '../controllers/sprintController.js';

sprintRouter.get('/', getSprints);

sprintRouter.route('/:projectId')
    .post(createSprint)
    .get(getSprintsByProjectId);

sprintRouter.route('/:sprintId')
    .patch(updateSprint)
    .delete(deleteSprintById)
    sprintRouter.get("/:sprintId/task",GetTasksBySprintId)
//sprintRouter.get('/:sprintId',getSprintById)

export default sprintRouter;
