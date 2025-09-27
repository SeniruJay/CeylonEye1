const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const TransportProvider = require("../models/TransportProvider");
const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../../uploads/transport");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'transport-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Get all providers
router.get("/", async (req, res) => {
  try {
    const providers = await TransportProvider.find().sort({ createdAt: -1 });
    res.json(providers);
  } catch (err) {
    console.error("Error fetching providers:", err);
    res.status(500).json({ 
      error: "Failed to fetch transport providers",
      message: err.message 
    });
  }
});

// Get single provider by ID
router.get("/:id", async (req, res) => {
  try {
    const provider = await TransportProvider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({ error: "Transport provider not found" });
    }
    res.json(provider);
  } catch (err) {
    console.error("Error fetching provider:", err);
    if (err.name === 'CastError') {
      return res.status(400).json({ error: "Invalid provider ID" });
    }
    res.status(500).json({ 
      error: "Failed to fetch transport provider",
      message: err.message 
    });
  }
});

// Add new provider
router.post("/", upload.array('images', 5), async (req, res) => {
  try {
    // Validate required fields
    const { name, contact, vehicleType } = req.body;
    if (!name || !contact || !vehicleType) {
      return res.status(400).json({ 
        error: "Missing required fields",
        required: ["name", "contact", "vehicleType"]
      });
    }

    // Process uploaded images
    const images = req.files ? req.files.map(file => `/uploads/transport/${file.filename}`) : [];

    const providerData = {
      ...req.body,
      images: images
    };

    const provider = new TransportProvider(providerData);
    await provider.save();
    res.status(201).json(provider);
  } catch (err) {
    console.error("Error creating provider:", err);
    
    // Clean up uploaded files if there's an error
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, (unlinkErr) => {
          if (unlinkErr) console.error("Error deleting file:", unlinkErr);
        });
      });
    }
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: "Validation error",
        details: err.message 
      });
    }
    res.status(500).json({ 
      error: "Failed to create transport provider",
      message: err.message 
    });
  }
});

// Update provider (supports multipart for images)
router.put("/:id", upload.array('images', 5), async (req, res) => {
  try {
    const existing = await TransportProvider.findById(req.params.id);
    if (!existing) {
      // clean up uploaded
      if (req.files) req.files.forEach(f => fs.unlink(f.path, () => {}));
      return res.status(404).json({ error: "Transport provider not found" });
    }

    // Build update payload from fields
    const updateFields = { ...req.body };

    // Normalize boolean/number fields when coming from multipart (strings)
    if (typeof updateFields.availability === 'string') {
      updateFields.availability = updateFields.availability === 'true';
    }
    if (typeof updateFields.seats === 'string') updateFields.seats = parseInt(updateFields.seats);
    if (typeof updateFields.price === 'string') updateFields.price = parseFloat(updateFields.price);

    // Handle images: start from existing list
    let images = Array.isArray(existing.images) ? [...existing.images] : [];

    // Remove selected existing images if provided
    if (req.body.removeImages) {
      try {
        const toRemove = Array.isArray(req.body.removeImages)
          ? req.body.removeImages
          : JSON.parse(req.body.removeImages);
        if (Array.isArray(toRemove)) {
          images = images.filter(img => !toRemove.includes(img));
          // delete files from disk
          toRemove.forEach(rel => {
            const filePath = path.join(__dirname, `..${rel.startsWith('/uploads') ? '/..' : ''}${rel}`);
            fs.unlink(filePath, () => {});
          });
        }
      } catch (e) {
        console.warn('Failed parsing removeImages:', e.message);
      }
    }

    // Append newly uploaded images
    if (req.files && req.files.length) {
      const newImgs = req.files.map(file => `/uploads/transport/${file.filename}`);
      images = images.concat(newImgs);
    }

    updateFields.images = images;

    const provider = await TransportProvider.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    res.json(provider);
  } catch (err) {
    console.error("Error updating provider:", err);
    // Clean up uploaded files on error
    if (req.files) req.files.forEach(f => fs.unlink(f.path, () => {}));
    if (err.name === 'CastError') {
      return res.status(400).json({ error: "Invalid provider ID" });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: "Validation error",
        details: err.message 
      });
    }
    res.status(500).json({ 
      error: "Failed to update transport provider",
      message: err.message 
    });
  }
});

// Delete provider
router.delete("/:id", async (req, res) => {
  try {
    const provider = await TransportProvider.findByIdAndDelete(req.params.id);
    
    if (!provider) {
      return res.status(404).json({ error: "Transport provider not found" });
    }
    
    res.json({ 
      message: "Transport provider deleted successfully",
      deletedProvider: provider
    });
  } catch (err) {
    console.error("Error deleting provider:", err);
    if (err.name === 'CastError') {
      return res.status(400).json({ error: "Invalid provider ID" });
    }
    res.status(500).json({ 
      error: "Failed to delete transport provider",
      message: err.message 
    });
  }
});

module.exports = router;
