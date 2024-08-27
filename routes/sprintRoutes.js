const express = require('express');
const sprintRouter = express.Router();
const {createSprint} = require('../controllers/sprintController');

sprintRouter.post('/create', createSprint);

module.exports = sprintRouter 