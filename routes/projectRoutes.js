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

module.exports = router;
