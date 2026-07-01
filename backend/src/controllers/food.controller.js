const foodModel = require('../models/food.model.js');
const foodPartnerModel = require('../models/foodpartner.model.js');
const storageService = require('../services/storage.services.js');
const likeModel = require('../models/likes.model.js');
const saveModel = require('../models/save.model.js');
const commentModel = require('../models/comment.model.js');
const {v4: uuid} = require('uuid');



async function createFood(req, res) {
    try {
        if (!req.file) {
            console.error("createFood: No file in request");
            return res.status(400).json({ message: "No video file provided" });
        }

        const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid());

        const foodItem = await foodModel.create({
            name: req.body.name,
            description: req.body.description,
            video: fileUploadResult.url,
            foodpartner: req.foodPartner._id
        });

        res.status(201).json({
            message: "Food item created successfully",
            foodItem: foodItem
        });
    } catch (error) {
        console.error("createFood: Error:", error);
        res.status(500).json({
            message: "Server error during creation",
            error: error.message
        });
    }
}

async function getFoodItems(req, res) {
    try {
        const userId = req.user ? req.user._id : null;
        const foodItems = await foodModel.find({});

        const enrichedFoodItems = await Promise.all(foodItems.map(async (item) => {
            const likeCount = await likeModel.countDocuments({ food: item._id });
            const commentCount = await commentModel.countDocuments({ food: item._id });
            
            let isLiked = false;
            let isSaved = false;

            if (userId) {
                isLiked = await likeModel.exists({ user: userId, food: item._id });
                isSaved = await saveModel.exists({ user: userId, food: item._id });
            }

            return {
                ...item.toObject(),
                likeCount,
                commentCount,
                isLiked: !!isLiked,
                isSaved: !!isSaved
            };
        }));

        res.status(200).json({
            message: "Food items fetched successfully",
            foodItems: enrichedFoodItems
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}

async function getFoodPartnerProfile(req, res) {
    try {
        const partnerId = req.params.id;
        const partner = await foodPartnerModel.findById(partnerId).select('-password');
        if (!partner) {
            return res.status(404).json({ message: 'Food Partner not found' });
        }

        const foodItems = await foodModel.find({ foodpartner: partnerId });

        res.status(200).json({
            message: "Food partner profile fetched successfully",
            partner,
            foodItems
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}

module.exports = {
    createFood,
    getFoodItems,
    getFoodPartnerProfile
}