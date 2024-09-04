import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    taskId: {
        type: mongoose.Schema.ObjectId,
        ref: "Task",
        require: true
    },
    createrId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        require: true
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

const Comments = mongoose.model("comment", commentSchema);

export default Comments;