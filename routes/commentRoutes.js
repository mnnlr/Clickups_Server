const express =require('express')
const  Commentrouter = express.Router();
const CommentController = require('../controllers/commentController');

const router = express.Router();

router.route('/')
.post(CommentController.createComment);

router.route('/:id')
.patch(CommentController.updateCommentById)
.delete(CommentController.deleteCommentById);

module.exports= Commentrouter;
