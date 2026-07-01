const likeModel = require('../models/likes.model');

async function toggleLike(req, res) {
    try {
        const { foodId } = req.params;
        const userId = req.user._id;

        const existingLike = await likeModel.findOne({ user: userId, food: foodId });
        if (existingLike) {
            await likeModel.deleteOne({ _id: existingLike._id });
            const likeCount = await likeModel.countDocuments({ food: foodId });
            return res.status(200).json({ message: "Unliked successfully", isLiked: false, likeCount });
        } else {
            await likeModel.create({ user: userId, food: foodId });
            const likeCount = await likeModel.countDocuments({ food: foodId });
            return res.status(200).json({ message: "Liked successfully", isLiked: true, likeCount });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = {
    toggleLike
};
