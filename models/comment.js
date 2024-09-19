import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.ObjectId, 
    ref: "Task",
    required: true 
  },
  creatorId: { 
    type: mongoose.Schema.ObjectId, 
    ref: "User",
   //required: true 
  },
  comment: {
    type: String,
    required: true
  },
  timeStamp: {
    type: Date,
    default: Date.now
  }
});

const Comments = mongoose.model("Comment", commentSchema); // Changed model name to 'Comment'

export default Comments;
