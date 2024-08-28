const express = require('express');
const taskRouter = express.Router();
const { showAllTasks, createTask, deleteTaskById, updateTaskById } = require('../controllers/taskController');
const Authenticated = require('../middleware/Authenticated');

taskRouter.route('/')
    .get(Authenticated ,showAllTasks)
    .post(Authenticated, createTask);

taskRouter.route('/:id')
    .patch(Authenticated, updateTaskById)
    .delete(Authenticated, deleteTaskById)
module.exports = taskRouter;