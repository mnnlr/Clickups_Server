import Comments from '../models/comment.js';

//create comment
const createComment = async (req, res) => {
    try {
        const { taskId, creatorId, comment } = req.body;
        const newComment = new Comments({
            taskId,
            creatorId,
            comment
        })
        const saveComment = await newComment.save();
        res.status(200).json({ message: "Comment Created Successfully", success: true })
    } catch (error) {
        res.status(500).json({ message: error.message, success: false })
    }

}

// update comment by id
const updateCommentById = async (req, res) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;
        const updateComment = await Comments.findByIdAndUpdate(id, { comment }, { new: true })
        if (!updateComment) {
            return res.status(404).json({ message: "Comment Not Found", success: false })
        }
        res.status(200).json({ message: "Comment Updated Successfully", success: true })
    } catch (error) {
        res.status(500).json({ message: error.message, duccess: true })
    }
}

//delete Comment BY id
const deleteCommentById = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteComment = await Comments.findByIdAndDelete(id);
        if (!deleteComment) {
            return res.status(404).json({ message: "Comment Not Found", success: false })
        }
        res.status(200).json({ message: "Delete Comment Successfully", success: true })
    } catch (error) {
        res.status(500).json({ message: error.message, success: false })
    }

    
}// Get Comment by ID
const getCommentById = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comments.findById(id).populate('creatorId taskId');
        if (!comment) {
            return res.status(404).json({ message: "Comment Not Found", success: false });
        }
        res.status(200).json({ comment, success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

export {
    createComment, updateCommentById, deleteCommentById, getCommentById
}