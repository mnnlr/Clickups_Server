import { Router } from "express";
import { getAllWorkspace, getWorkspaceById, handleCreateWorkspace, handleDeleteWorkspace, handleUpdateWorkspace } from "../controllers/workspaceController.js";

const workspceRouter = Router();

workspceRouter.route('/').get(getAllWorkspace).post(handleCreateWorkspace);
workspceRouter.route('/:id').get(getWorkspaceById).patch(handleUpdateWorkspace).delete(handleDeleteWorkspace);


export default workspceRouter;