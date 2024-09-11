import { Router } from "express";
import isAuthenticated from "../middleware/Authenticated.js";
import authenticate from "../controllers/authenticateController.js";



const router = Router();

router.route('/').get(isAuthenticated, authenticate)

export default router;