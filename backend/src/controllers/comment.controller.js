const commentModel = require('../models/comment.model');

async function addComment(req, res) {
    try {
        const { foodId } = req.params;
        const userId = req.user._id;
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({ message: "Comment text is required" });
        }

        const comment = await commentModel.create({
            user: userId,
            food: foodId,
            text: text
        });

        const populatedComment = await commentModel.findById(comment._id).populate('user', 'fullName email');

        res.status(201).json({
            message: "Comment added successfully",
            comment: populatedComment
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function getComments(req, res) {
    try {
        const { foodId } = req.params;
        const comments = await commentModel.find({ food: foodId })
            .populate('user', 'fullName email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Comments fetched successfully",
            comments: comments
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = {
    addComment,
    getComments
};
