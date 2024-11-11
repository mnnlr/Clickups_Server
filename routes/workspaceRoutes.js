import { Router } from "express";
import { getAllWorkspace, handleCreateWorkspace, handleDeleteWorkspace, handleUpdateWorkspace } from "../controllers/workspaceController.js";

const workspceRouter = Router();

workspceRouter.route('/').get(getAllWorkspace).post(handleCreateWorkspace);
workspceRouter.route('/:id').patch(handleUpdateWorkspace).delete(handleDeleteWorkspace);


export default workspceRouter;