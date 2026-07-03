const userModel = require("../models/user.model");
const foodPartnerModel = require("../models/foodpartner.model");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
};

async function registerUser(req, res) {
    try {
        const {fullName, email, password, phone, address, contactName } = req.body;

        const isUserAlreadyExists = await userModel.findOne({
            email
        })

        if(isUserAlreadyExists){
            return res.status(400).json({
                message: "User already exists"  
            })
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await userModel.create({
            fullName,
            email,
            password: hashedPassword,
            phone,
            address,
            contactName
        })

        const token = jwt.sign({
            id: user._id,
        }, process.env.JWT_SECRET)

        res.cookie("token", token, cookieOptions)

        res.status(201).json({
            message: "User registered successfully",
            user:{
                id: user._id,
                fullName: user.fullName,
                email: user.email
            } 
        })
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const token = jwt.sign({
            id: user._id,
        }, process.env.JWT_SECRET)

        res.cookie("token", token, cookieOptions)

        res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        })
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
}

async function logoutUser(req, res) {
    try {
        res.clearCookie("token", cookieOptions);
        res.status(200).json({
            message: "User logged out successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
}

async function registerFoodPartner(req, res) {
    try {
        const { name, email, password, phone, address, contactName } = req.body;

        const isFoodPartnerAlreadyExists = await foodPartnerModel.findOne({
            email
        })

        if(isFoodPartnerAlreadyExists){
            return res.status(400).json({
                message: "Food Partner already exists"  
            })
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const foodPartner = await foodPartnerModel.create({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            contactName
        })

        const token = jwt.sign({
            id: foodPartner._id,
        }, process.env.JWT_SECRET)

        res.cookie("token", token, cookieOptions)

        res.status(201).json({
            message: "Food Partner registered successfully",
            foodPartner:{
                id: foodPartner._id,
                name: foodPartner.name,
                email: foodPartner.email,
                phone: foodPartner.phone,
                address: foodPartner.address,
                contactName: foodPartner.contactName
            } 
        })

    } 
    catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
}

async function loginFoodPartner(req, res) {
    try {
        const { email, password } = req.body; 
    
        const foodPartner = await foodPartnerModel.findOne({ email });

        if (!foodPartner) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }       

        const isPasswordValid = await bcrypt.compare(password, foodPartner.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const token = jwt.sign({
            id: foodPartner._id,
        }, process.env.JWT_SECRET)  

        res.cookie("token", token, cookieOptions)

        res.status(200).json({  
            message: "Food Partner logged in successfully",
            foodPartner: {
                id: foodPartner._id, 
                name: foodPartner.name,
                email: foodPartner.email   
            } 
        })

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
}

function logoutFoodPartner(req, res) {  
    try {
        res.clearCookie("token", cookieOptions);
        res.status(200).json({
            message: "Food Partner logged out successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
}

async function getMe(req, res) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(200).json({ loggedIn: false });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await userModel.findById(decoded.id);
        if (user) {
            return res.status(200).json({
                loggedIn: true,
                role: 'user',
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email
                }
            });
        }

        const foodPartner = await foodPartnerModel.findById(decoded.id);
        if (foodPartner) {
            return res.status(200).json({
                loggedIn: true,
                role: 'partner',
                partner: {
                    id: foodPartner._id,
                    name: foodPartner.name,
                    email: foodPartner.email
                }
            });
        }

        return res.status(200).json({ loggedIn: false });
    } catch (error) {
        return res.status(200).json({ loggedIn: false, error: error.message });
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner,
    getMe
}