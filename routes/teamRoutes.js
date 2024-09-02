import express from 'express';
import Authenticated from '../middleware/Authenticated.js';
import { createTeam, getAllTeamsMembers, deleteTeamMember, } from '../controllers/teamController.js';

const TeamRoutes = express.Router();

TeamRoutes.route('/')
    .post(Authenticated, createTeam)
    .get(Authenticated, getAllTeamsMembers)
    .delete(Authenticated, deleteTeamMember);

export default TeamRoutes; 