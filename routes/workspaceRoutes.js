import { Router } from "express";
import { addMember, getAllWorkspace, getWorkspaceById, handleCreateWorkspace, handleDeleteWorkspace, handleUpdateWorkspace, removeMemberFromWorkspace,getAllUserWorkspaces } from "../controllers/workspaceController.js";

const workspceRouter = Router();
workspceRouter.patch("/:workspaceId/add", addMember);
// workspceRouter.patch("/:workspaceId/remove",removeMemberFromWorkspace)

workspceRouter.route('/')
  .get(getAllWorkspace)// Get all workspaces
  .post(handleCreateWorkspace);  // Create a new workspace

workspceRouter.route('/:id')
  .get(getWorkspaceById) 
  .patch(handleUpdateWorkspace)  
  .delete(handleDeleteWorkspace);  

workspceRouter.route('/UserWorkspaces/:id')
.get(getAllUserWorkspaces) // get only login user workspaces

export default workspceRouter;