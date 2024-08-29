import express from 'express';
const router = express.Router();
import validateProjectCreation from "../middleware/Projectvalidation.js";
import {CreateProject,
    getAllProject,
    getAllPeojectById,
    updateProject,
    deleteProject,
} from "../controllers/projectController.js";

router.route('/')
    .get(getAllProject)
    .post(validateProjectCreation, CreateProject);

router.route('/:id')
    .get(getAllPeojectById)
    .patch(validateProjectCreation, updateProject)
    .delete(deleteProject);


// router.delete('/:projectId/team/:userId', projectController.removeMemberFromTeam);
// router.patch('/:projectId/team/', projectController.addMemberToTeam);


export default router;
