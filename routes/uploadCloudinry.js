import {Router} from 'express';
import { upload } from '../utils/cloudinary.js';
import { upload_cloudinary } from '../controllers/uploadCloudinary.js';

const router = Router();

router.post('/docs', upload.single('file'), upload_cloudinary);

export default router;