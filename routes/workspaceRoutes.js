import { Router } from "express";
import { addMemberToWorkspace, getAllWorkspace, getWorkspaceById, handleCreateWorkspace, handleDeleteWorkspace, handleUpdateWorkspace, removeMemberFromWorkspace } from "../controllers/workspaceController.js";

const workspceRouter = Router();
workspceRouter.patch("/:workspaceId/add", addMemberToWorkspace);
workspceRouter.patch("/:workspaceId/remove",removeMemberFromWorkspace)

// Routes for retrieving all workspaces or creating a new workspace
workspceRouter.route('/')
  .get(getAllWorkspace)    // Get all workspaces
  .post(handleCreateWorkspace);  // Create a new workspace

// Routes for working with a specific workspace by ID
workspceRouter.route('/:id')
  .get(getWorkspaceById)   // Get a workspace by its ID
  .patch(handleUpdateWorkspace)  // Update a workspace by its ID
  .delete(handleDeleteWorkspace);  // Delete a workspace by its ID


export default workspceRouter;