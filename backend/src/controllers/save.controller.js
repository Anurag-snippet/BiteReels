const saveModel = require('../models/save.model');
const foodModel = require('../models/food.model');
const likeModel = require('../models/likes.model');
const commentModel = require('../models/comment.model');

async function toggleSave(req, res) {
    try {
        const { foodId } = req.params;
        const userId = req.user._id;

        const existingSave = await saveModel.findOne({ user: userId, food: foodId });
        if (existingSave) {
            await saveModel.deleteOne({ _id: existingSave._id });
            return res.status(200).json({ message: "Unsaved successfully", isSaved: false });
        } else {
            await saveModel.create({ user: userId, food: foodId });
            return res.status(200).json({ message: "Saved successfully", isSaved: true });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function getSavedFoodItems(req, res) {
    try {
        const userId = req.user._id;
        const savedRecords = await saveModel.find({ user: userId }).populate('food');
        
        const savedFoods = savedRecords
            .map(record => record.food)
            .filter(food => food !== null);

        const enrichedSavedFoods = await Promise.all(savedFoods.map(async (item) => {
            const likeCount = await likeModel.countDocuments({ food: item._id });
            const commentCount = await commentModel.countDocuments({ food: item._id });
            const isLiked = await likeModel.exists({ user: userId, food: item._id });
            
            return {
                ...item.toObject(),
                likeCount,
                commentCount,
                isLiked: !!isLiked,
                isSaved: true
            };
        }));

        res.status(200).json({
            message: "Saved food items fetched successfully",
            foodItems: enrichedSavedFoods
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = {
    toggleSave,
    getSavedFoodItems
};
