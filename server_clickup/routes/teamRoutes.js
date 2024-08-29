import express from 'express';
const TeamRoutes = express.Router();

import { createTeam } from '../controllers/teamController.js';
import Authenticated from '../middleware/Authenticated.js';

TeamRoutes.post('/', Authenticated, createTeam);

export default TeamRoutes; 