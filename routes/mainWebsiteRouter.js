import { Router } from "express";
import { getWorkspaceData } from "../controllers/mainWebsiteController.js";

const mainWebsiteRouter = Router();

mainWebsiteRouter.route("/workspaceData").get(getWorkspaceData);

export default mainWebsiteRouter;
