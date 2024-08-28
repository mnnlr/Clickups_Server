const express = require('express');
const sprintRouter = express.Router();
const {getSprints, createSprint, deleteSprint} = require('../controllers/sprintController') 
sprintRouter.get('/',getSprints);
sprintRouter.post('/', createSprint);
sprintRouter.delete('/:sprintId', deleteSprint);
module.exports = sprintRouter 
