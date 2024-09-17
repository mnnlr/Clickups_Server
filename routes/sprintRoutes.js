import express from 'express';
const sprintRouter = express.Router();

import  { getSprints, createSprint, updateSprint, getSprintsByProjectId, deleteSprintById, GetTasksBySprintId} from '../controllers/sprintController.js';

sprintRouter.get('/', getSprints);

sprintRouter.route('/:projectId')
    .post(createSprint)
    .get(getSprintsByProjectId);

sprintRouter.route('/:sprintId')
    .patch(updateSprint)
    .get(GetTasksBySprintId)
    .delete(deleteSprintById)
//sprintRouter.get('/:sprintId',getSprintById)

export default sprintRouter;
