import express from 'express';
const sprintRouter = express.Router();

import {getSprints, createSprint, deleteSprint} from '../controllers/sprintController.js';

sprintRouter.get('/',getSprints);
sprintRouter.post('/', createSprint);
sprintRouter.delete('/:sprintId', deleteSprint);


export default sprintRouter;
