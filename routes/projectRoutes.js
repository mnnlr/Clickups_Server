const mongoose = require('mongoose')
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController')


router.route('/')
    .get(projectController.getAllProject)
    .post(projectController.CreateProject);

router.route('/:id')
    .get(projectController.getAllPeojectById)
    .patch(projectController.updateProject)
    .delete(projectController.deleteProject);


router.delete('/:projectId/team/:userId', projectController.removeMemberFromTeam);
// router.patch('/:projectId/team/', projectController.addMemberToTeam);


module.exports = router;
