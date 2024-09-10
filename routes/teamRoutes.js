import express from 'express';
import Authenticated from '../middleware/Authenticated.js';
import { createTeam, getAllTeamsMembers, deleteTeam, updateTeam, deleteTeamMember } from '../controllers/teamController.js';

const TeamRoutes = express.Router();

TeamRoutes.route('/')
    .post(Authenticated, createTeam)
    .get(Authenticated, getAllTeamsMembers)
    .delete(Authenticated, deleteTeam)
    .patch(Authenticated, updateTeam);

TeamRoutes.route('/delete-member')
    .delete(Authenticated, deleteTeamMember)

export default TeamRoutes; 