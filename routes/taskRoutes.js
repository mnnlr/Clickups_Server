const express = require('express');
const taskRouter = express.Router();
const { showAllTasks, createTask } = require('../controllers/taskController')

taskRouter.route('/')
    .get(showAllTasks)
    .post(createTask);

module.exports = taskRouter