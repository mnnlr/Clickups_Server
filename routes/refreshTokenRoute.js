import {Router} from 'express';
import getRefreshToken from '../controllers/refreshTokenController.js';

const router = Router();
router.get("/api/v1/refresh-token", getRefreshToken);

export default router;