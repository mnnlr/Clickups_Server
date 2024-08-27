const express =require('express')
const  Commentrouter = express.Router();
const CommentController = require('../controllers/commentController');

router.route('/')
.post(CommentController.createComment);

router.route('/:id')
.patch(CommentController.updateCommentById)
.delete(CommentController.deleteCommentById);

module.exports= Commentrouter;
