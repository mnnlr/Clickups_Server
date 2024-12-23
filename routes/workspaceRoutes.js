import { Router } from "express";
import { addMember, getAllWorkspace, getWorkspaceById, handleCreateWorkspace, handleDeleteWorkspace, handleUpdateWorkspace } from "../controllers/workspaceController.js";

const workspceRouter = Router();
workspceRouter.patch("/:workspaceId/add", addMember);
// workspceRouter.patch("/:workspaceId/remove",removeMemberFromWorkspace)

workspceRouter.route('/')
  .get(getAllWorkspace)   
  .post(handleCreateWorkspace); 

workspceRouter.route('/:id')
  .get(getWorkspaceById) 
  .patch(handleUpdateWorkspace)  
  .delete(handleDeleteWorkspace);  


export default workspceRouter;