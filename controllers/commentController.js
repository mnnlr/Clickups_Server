import Comments from '../models/comment.js';

// Create comment
const createComment = async (req, res) => {
  try {
    const { taskId,creatorId, comment } = req.body;
    
    const newComment = new Comments({
      taskId,
      creatorId,
      comment
    });
    
    const savedComment = await newComment.save();
    res.status(201).json({ message: "Comment Created Successfully", success: true, data: savedComment });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// Update comment by ID
const updateCommentById = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    // Validate input
    if (!comment) {
      return res.status(400).json({ message: "Comment text is required", success: false });
    }

    const updatedComment = await Comments.findByIdAndUpdate(id, { comment }, { new: true });

    if (!updatedComment) {
      return res.status(404).json({ message: "Comment Not Found", success: false });
    }

    res.status(200).json({ message: "Comment Updated Successfully", success: true, data: updatedComment });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// Delete comment by ID
const deleteCommentById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedComment = await Comments.findByIdAndDelete(id);

    if (!deletedComment) {
      return res.status(404).json({ message: "Comment Not Found", success: false });
    }

    res.status(200).json({ message: "Comment Deleted Successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// Get comments by task ID
const getCommentsByTaskId = async (req, res) => {
  try {
    console.log('req.params:', req.params); 
    const { taskId } = req.params;
    //console.log('Fetching comments for taskId:', taskId); 
   const comments = await Comments.find({ taskId }).populate('creatorId', 'name'); 
   // console.log('Fetched comments:', comments); 

    res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { createComment, updateCommentById, deleteCommentById, getCommentsByTaskId };
