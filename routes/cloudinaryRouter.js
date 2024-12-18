import express from 'express';
import { uploadDataToCloudinary, getDataFromCloudinary, deleteDataFromCloudinary } from '../controllers/cloudinaryController.js';

const cloudinaryRouter = express();

cloudinaryRouter.route('/').post(uploadDataToCloudinary).get(getDataFromCloudinary)
cloudinaryRouter.route('/:documentId').delete(deleteDataFromCloudinary);

export default cloudinaryRouter;