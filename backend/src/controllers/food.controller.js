const foodModel = require('../models/food.model.js');
const foodPartnerModel = require('../models/foodpartner.model.js');
const storageService = require('../services/storage.services.js');
const {v4: uuid} = require('uuid');



async function createFood(req, res) {

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

}

async function getFoodItems(req, res) {
    const foodItems = await foodModel.find({})
    res.status(200).json({
        message: "Food items fetched successfully",
        foodItems: foodItems
    });
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