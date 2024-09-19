import express from 'express';
const commentRouter = express.Router();
import {createComment, updateCommentById, deleteCommentById,getCommentsByTaskId} from '../controllers/commentController.js';

commentRouter.route('/')
.post(createComment);

commentRouter.route('/:id')
.patch(updateCommentById)
.delete(deleteCommentById);

commentRouter.route('/:taskId')
.get(getCommentsByTaskId);
// commentRouter.get('/',);

export default commentRouter; 
