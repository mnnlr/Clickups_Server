const express = require('express');
const TeamRouter = express.Router();
const { createTeam } = require('../controllers/teamController');
const Authenticated = require('../middleware/Authenticated');

TeamRouter.post('/', Authenticated, createTeam);

module.exports = TeamRouter; 