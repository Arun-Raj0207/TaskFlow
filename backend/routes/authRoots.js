const express = require("express");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const User = require("../models/User");
const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findByEmail(email);

        if (userExists) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.createUser(name, email, hashedPassword);

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;
