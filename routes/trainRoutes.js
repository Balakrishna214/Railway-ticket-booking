const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const Train = require("../models/Train");
const User = require("../models/User"); // Ensure User model is imported
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(cookieParser());

// Signup Route
router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error("Signup Error:", err.message);
        res.status(500).json({ error: "Error creating user" });
    }
});

// Login Route with JWT stored in Cookies
router.post("/login", async (req, res) => {
    const { name, password } = req.body;
    try {
        const user = await User.findOne({ name });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch);
        
        if (password!==name) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign({ userId: user._id, role: user.role }, "secretkey", {
            expiresIn: "1h",
        });

        // Store token in HTTP-Only Cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            maxAge: 60 * 60 * 1000, // 1 hour expiration
        });

        res.json({ message: "Login successful" });
    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ error: "Error logging in" });
    }
});

// Add a new train (Admin only)
router.post("/addtrain", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const train = new Train(req.body);
        await train.save();
        res.status(201).json(train);
    } catch (err) {
        console.error("Add Train Error:", err.message);
        res.status(400).json({ error: "Error adding train" });
    }
});

// Remove a train by ID (Admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const train = await Train.findByIdAndDelete(req.params.id);
        if (!train) {
            return res.status(404).json({ error: "Train not found" });
        }
        res.status(200).json({ message: "Train removed successfully" });
    } catch (err) {
        console.error("Delete Train Error:", err.message);
        res.status(400).json({ error: "Error deleting train" });
    }
});

// Update the status of a train (Admin only)
router.patch("/:id/status", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const train = await Train.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        if (!train) {
            return res.status(404).json({ error: "Train not found" });
        }
        res.status(200).json(train);
    } catch (err) {
        console.error("Update Train Status Error:", err.message);
        res.status(400).json({ error: "Error updating train status" });
    }
});

// Get all trains (Protected route)
router.get("/", authMiddleware, async (req, res) => {
    try {
        const trains = await Train.find();
        res.json(trains);
    } catch (err) {
        console.error("Get Trains Error:", err.message);
        res.status(500).json({ error: "Error fetching trains" });
    }
});

// Search trains by source and destination (Protected route)
router.get("/search", authMiddleware, async (req, res) => {
    try {
        // const { from, to } = req.query;
        const {source,destination}=req.query
        console.log(source,destination);
        
        const trains = await Train.find({
            source: new RegExp(source, "i"),
            destination: new RegExp(destination, "i"),
        });
        res.json(trains);
    } catch (err) {
        console.error("Search Trains Error:", err.message);
        res.status(500).json({ error: "Error searching trains" });
    }
});

module.exports = router;
