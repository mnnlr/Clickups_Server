import express from 'express';
const commentRouter = express.Router();
import {createComment, updateCommentById, deleteCommentById} from '../controllers/commentController.js';

commentRouter.route('/')
.post(createComment);

commentRouter.route('/:id')
.patch(updateCommentById)
.delete(deleteCommentById);
// commentRouter.get('/',);

export default commentRouter; 
