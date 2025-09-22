const express = require("express");
const TransportProvider = require("../models/TransportProvider");
const router = express.Router();

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
router.post("/", async (req, res) => {
  try {
    // Validate required fields
    const { name, contact, vehicleType } = req.body;
    if (!name || !contact || !vehicleType) {
      return res.status(400).json({ 
        error: "Missing required fields",
        required: ["name", "contact", "vehicleType"]
      });
    }

    const provider = new TransportProvider(req.body);
    await provider.save();
    res.status(201).json(provider);
  } catch (err) {
    console.error("Error creating provider:", err);
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

// Update provider
router.put("/:id", async (req, res) => {
  try {
    const provider = await TransportProvider.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!provider) {
      return res.status(404).json({ error: "Transport provider not found" });
    }
    
    res.json(provider);
  } catch (err) {
    console.error("Error updating provider:", err);
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
