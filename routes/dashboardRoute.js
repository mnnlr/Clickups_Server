import { Router } from "express";
import * as dashboardController from "../controllers/dashboardController.js";

const router = Router();

router.route("/")
    .get(dashboardController.getAllDashboard)
    .post(dashboardController.createDashboard)

router.delete("/:id", dashboardController.deleteDashboardById)

export default router