const express = require("express");
const Accommodation = require("../models/Accommodation");
const router = express.Router();

// Create
router.post("/", async (req, res) => {
  try {
    const doc = await Accommodation.create(req.body);
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

// Update
router.put("/:id", async (req, res) => {
  try {
    const doc = await Accommodation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: "Failed to update", message: err.message });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    const doc = await Accommodation.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted", deleted: doc });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete", message: err.message });
  }
});

module.exports = router;


