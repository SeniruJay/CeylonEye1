const express = require("express");
const multer = require("multer");
const path = require("path");
const Location = require("../models/Location");
const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/location");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
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

// Create a new location with image upload
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, region, type, description } = req.body;
    const image = req.file ? `/uploads/location/${req.file.filename}` : "";
    const doc = await Location.create({
      name,
      region,
      type,
      description,
      image,
    });
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ error: "Failed to create", message: err.message });
  }
});

// Get all locations with filtering
router.get("/", async (req, res) => {
  try {
    const { q, region, type } = req.query;
    const filter = {};
    if (q) filter.name = { $regex: q, $options: "i" };
    if (region) filter.region = region;
    if (type) filter.type = type;
    const docs = await Location.find(filter).sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: "Failed to list", message: err.message });
  }
});

// Get a single location
router.get("/:id", async (req, res) => {
  try {
    const doc = await Location.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch {
    res.status(400).json({ error: "Invalid id" });
  }
});

// Update a location with optional image upload
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, region, type, description } = req.body;
    const updateData = { name, region, type, description };
    if (req.file) {
      updateData.image = `/uploads/location/${req.file.filename}`;
    }
    const doc = await Location.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: "Failed to update", message: err.message });
  }
});

// Delete a location
router.delete("/:id", async (req, res) => {
  try {
    const doc = await Location.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted", deleted: doc });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete", message: err.message });
  }
});

module.exports = router;
