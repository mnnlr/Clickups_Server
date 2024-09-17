import express from 'express';
import validateProjectCreation from "../middleware/Projectvalidation.js";
import {
    CreateProject,
    getAllProject,
    getAllPeojectById,
    updateProject,
    deleteProject,
    getProjectsBySprintId,
} from "../controllers/projectController.js";

const router = express.Router();

router.route('/')
    .get(getAllProject)
    .post(validateProjectCreation, CreateProject);

    router.get("/:projectId",getProjectsBySprintId)
router.route('/:id')
    .get(getAllPeojectById)
    .patch(validateProjectCreation, updateProject)
    .delete(deleteProject);

export default router;
