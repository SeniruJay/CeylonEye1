const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users", message: err.message });
  }
});

// Get single user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Failed to fetch user", message: err.message });
  }
});

// Create user
router.post("/", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error("Error creating user:", err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation error', details: err.message });
    }
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Duplicate username or email' });
    }
    res.status(500).json({ error: "Failed to create user", message: err.message });
  }
});

// Update user (partial)
router.put("/:id", async (req, res) => {
  try {
    const updates = { ...req.body };
    // If password supplied, it will be re-hashed by pre-save when using save(); here we use findById then save.
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    Object.assign(user, updates);
    await user.save();
    res.json(user);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Failed to update user", message: err.message });
  }
});

// Delete user
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted", deletedUser: user });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Failed to delete user", message: err.message });
  }
});

module.exports = router;
