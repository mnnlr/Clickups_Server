import express from 'express';
import validateProjectCreation from "../middleware/Projectvalidation.js";
import {
    CreateProject,
    getAllProject,
    getAllPeojectById,
    updateProject,
    deleteProject,
} from "../controllers/projectController.js";

const router = express.Router();

router.route('/')
    .get(getAllProject)
    .post(validateProjectCreation, CreateProject);

router.route('/:id')
    .get(getAllPeojectById)
    .patch(validateProjectCreation, updateProject)
    .delete(deleteProject);

export default router;
