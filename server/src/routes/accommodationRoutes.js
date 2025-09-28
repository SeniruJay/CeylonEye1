const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Accommodation = require("../models/Accommodation");
const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/accommodation");
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

// Create a new accommodation with image upload
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, type, city, price, rating, availability } = req.body;
    const image = req.file ? `/uploads/accommodation/${req.file.filename}` : "";
    const doc = await Accommodation.create({
      name,
      type,
      city,
      price: Number(price),
      rating: Number(rating),
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
    const { q, type, city, maxPrice } = req.query;
    const filter = {};
    if (q) filter.name = { $regex: q, $options: "i" };
    if (type) filter.type = type;
    if (city) filter.city = city;
    if (maxPrice) filter.price = { $lte: Number(maxPrice) };
    const docs = await Accommodation.find(filter).sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: "Failed to list", message: err.message });
  }
});

// Get by id
router.get("/:id", async (req, res) => {
  try {
    const doc = await Accommodation.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: "Invalid id" });
  }
});

// Update an accommodation with optional image upload
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, type, city, price, rating, availability } = req.body;
    const updateData = {
      name,
      type,
      city,
      price: Number(price),
      rating: Number(rating),
      availability: availability === "true",
    };
    if (req.file) {
      updateData.image = `/uploads/accommodation/${req.file.filename}`;
      // Delete old image if it exists
      const oldDoc = await Accommodation.findById(req.params.id);
      if (oldDoc && oldDoc.image) {
        const oldImagePath = path.join(__dirname, "..", "public", oldDoc.image);
        fs.unlink(oldImagePath, (err) => {
          if (err && err.code !== "ENOENT")
            console.error("Failed to delete old image:", err);
        });
      }
    }
    const doc = await Accommodation.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: "Failed to update", message: err.message });
  }
});

// Delete an accommodation and its image
router.delete("/:id", async (req, res) => {
  try {
    const doc = await Accommodation.findByIdAndDelete(req.params.id);
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
