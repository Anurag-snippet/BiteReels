const foodPartnerModel = require('../models/foodpartner.model.js');
const userModel = require('../models/user.model.js');
const jwt = require('jsonwebtoken');

async function authFoodPartnerMiddleware(req, res, next) {
    
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Please login first' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        const foodPartner = await foodPartnerModel.findById(decoded.id);
        if (!foodPartner) {
            return res.status(401).json({ message: 'Access denied. Partners only.' });
        }

        req.foodPartner = foodPartner;
        next();

    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

}

async function authUserMiddleware(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Please login first' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Access denied. Users only.' });
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

}
async function optionalAuthUserMiddleware(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        req.user = null;
        return next();
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        req.user = user || null;
        next();
    } catch (error) {
        req.user = null;
        next();
    }
}

async function authAnyMiddleware(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Please login first' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if user
        const user = await userModel.findById(decoded.id);
        if (user) {
            req.user = user;
            return next();
        }
        
        // Check if partner
        const foodPartner = await foodPartnerModel.findById(decoded.id);
        if (foodPartner) {
            req.foodPartner = foodPartner;
            return next();
        }
        
        return res.status(401).json({ message: 'Access denied.' });
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

module.exports = {
    authFoodPartnerMiddleware,
    authUserMiddleware,
    optionalAuthUserMiddleware,
    authAnyMiddleware
}