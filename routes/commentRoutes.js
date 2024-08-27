const express = require('express');
const commentRouter = express.Router();
const CommentController = require('../controllers/commentController');

<<<<<<< HEAD
const router = express.Router();

router.route('/')
=======
commentRouter.route('/')
>>>>>>> 8fb122f66bce2a6c21542a8d5728302f2624e99c
.post(CommentController.createComment);

commentRouter.route('/:id')
.patch(CommentController.updateCommentById)
.delete(CommentController.deleteCommentById);
commentRouter.get('/',);

module.exports = commentRouter; 
