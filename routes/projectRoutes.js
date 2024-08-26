const mongoose = require('mongoose')
const express = require('express');
const router = express.Router();
const projectController = require('../Controllers/projectController')

router.post('/create',projectController.CreateProject);
router.get('/',projectController.getAllProject);
router.get('/:id',projectController.getAllPeojectById);
router.put('/:id',projectController.updateProject);
router.delete('/:id',projectController.deleteProject);

module.exports = router;
