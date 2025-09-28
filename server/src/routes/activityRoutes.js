const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Activity = require("../models/Activity");
const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/activity");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `image-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG and PNG images are allowed"));
    }
  },
});

// Create a new activity with image upload
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, category, location, duration, price, availability } =
      req.body;
    const image = req.file ? `/uploads/activity/${req.file.filename}` : "";
    const doc = await Activity.create({
      name,
      category,
      location,
      duration: duration || "",
      price: Number(price),
      availability: availability === "true",
      image,
    });
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ error: "Failed to create", message: err.message });
  }
});

// List with basic filters
router.get("/", async (req, res) => {
  try {
    const { q, category, location } = req.query;
    const filter = {};
    if (q) filter.name = { $regex: q, $options: "i" };
    if (category) filter.category = category;
    if (location) filter.location = location;
    const docs = await Activity.find(filter).sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: "Failed to list", message: err.message });
  }
});

// Get by id
router.get("/:id", async (req, res) => {
  try {
    const doc = await Activity.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch {
    res.status(400).json({ error: "Invalid id" });
  }
});

// Update an activity with optional image upload
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, category, location, duration, price, availability } =
      req.body;
    const updateData = {
      name,
      category,
      location,
      duration: duration || "",
      price: Number(price),
      availability: availability === "true",
    };
    if (req.file) {
      updateData.image = `/uploads/activity/${req.file.filename}`;
      // Delete old image if it exists
      const oldDoc = await Activity.findById(req.params.id);
      if (oldDoc && oldDoc.image) {
        const oldImagePath = path.join(__dirname, "..", "public", oldDoc.image);
        fs.unlink(oldImagePath, (err) => {
          if (err && err.code !== "ENOENT")
            console.error("Failed to delete old image:", err);
        });
      }
    }
    const doc = await Activity.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: "Failed to update", message: err.message });
  }
});

// Delete an activity and its image
router.delete("/:id", async (req, res) => {
  try {
    const doc = await Activity.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    if (doc.image) {
      const imagePath = path.join(__dirname, "..", "public", doc.image);
      fs.unlink(imagePath, (err) => {
        if (err && err.code !== "ENOENT")
          console.error("Failed to delete image:", err);
      });
    }
    res.json({ message: "Deleted", deleted: doc });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete", message: err.message });
  }
});

module.exports = router;
