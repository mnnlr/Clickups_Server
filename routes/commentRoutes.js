const express = require('express');
const commentRouter = express.Router();
const CommentController = require('../controllers/commentController');

const router = express.Router();

router.route('/')
commentRouter.route('/')
.post(CommentController.createComment);

commentRouter.route('/:id')
.patch(CommentController.updateCommentById)
.delete(CommentController.deleteCommentById);
commentRouter.get('/',);

module.exports = commentRouter; 
