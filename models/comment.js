const mongoose = require("mongoose");

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

const commet = mongoose.model("comment", commentSchema);
module.exports = commet;