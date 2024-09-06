import express from 'express';
import Authenticated from '../middleware/Authenticated.js';
import { createTeam, getAllTeamsMembers, deleteTeam, updateTeam } from '../controllers/teamController.js';

const TeamRoutes = express.Router();

TeamRoutes.route('/')
    .post(Authenticated, createTeam)
    .get(Authenticated, getAllTeamsMembers)
    .delete(Authenticated, deleteTeam)
    .patch(Authenticated, updateTeam);

export default TeamRoutes; 