const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "ceyloneye_secret_key_2024";

// Generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });
};

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, phone, role = 'user' } = req.body;

    // Validate required fields
    if (!username || !email || !password || !firstName || !lastName || !phone) {
      return res.status(400).json({ 
        error: "All fields are required",
        required: ["username", "email", "password", "firstName", "lastName", "phone"]
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: "User already exists with this email or username" 
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      firstName,
      lastName,
      phone,
      role
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Registration error:", err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: "Validation error",
        details: err.message 
      });
    }
    res.status(500).json({ 
      error: "Failed to register user",
      message: err.message 
    });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { username, password, role = 'user' } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        error: "Username and password are required" 
      });
    }

    // Find user by username or email
    const user = await User.findOne({ 
      $or: [{ username }, { email: username }],
      role: role
    });

    if (!user) {
      return res.status(401).json({ 
        error: "Invalid credentials" 
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ 
        error: "Account is deactivated" 
      });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: "Invalid credentials" 
      });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ 
      error: "Failed to login",
      message: err.message 
    });
  }
});

// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token." });
  }
};

// Get current user profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ 
      error: "Failed to fetch profile",
      message: err.message 
    });
  }
});

// Update user profile
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { firstName, lastName, phone, address, preferences } = req.body;
    
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (preferences) updateData.preferences = preferences;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user
    });

  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ 
      error: "Failed to update profile",
      message: err.message 
    });
  }
});

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: "Access denied. Admin privileges required." });
  }
  next();
};

// Get all users (Admin only)
router.get("/users", verifyToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (err) {
    console.error("Users fetch error:", err);
    res.status(500).json({ 
      error: "Failed to fetch users",
      message: err.message 
    });
  }
});

// Update user (Admin only)
router.put("/users/:id", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { isActive, role } = req.body;
    
    const updateData = {};
    if (isActive !== undefined) updateData.isActive = isActive;
    if (role) updateData.role = role;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      user
    });

  } catch (err) {
    console.error("User update error:", err);
    res.status(500).json({ 
      error: "Failed to update user",
      message: err.message 
    });
  }
});

// Delete user (Admin only)
router.delete("/users/:id", verifyToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "User deleted successfully",
      deletedUser: { id: user._id, username: user.username }
    });

  } catch (err) {
    console.error("User deletion error:", err);
    res.status(500).json({ 
      error: "Failed to delete user",
      message: err.message 
    });
  }
});

module.exports = { router, verifyToken, requireAdmin };
