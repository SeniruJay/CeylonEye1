const express = require("express");
const Activity = require("../models/Activity");
const router = express.Router();

router.post("/", async (req, res) => {
  try { const doc = await Activity.create(req.body); res.status(201).json(doc); }
  catch (err) { res.status(400).json({ error: "Failed to create", message: err.message }); }
});

router.get("/", async (req, res) => {
  try {
    const { q, category, location } = req.query;
    const filter = {};
    if (q) filter.name = { $regex: q, $options: "i" };
    if (category) filter.category = category;
    if (location) filter.location = location;
    const docs = await Activity.find(filter).sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) { res.status(500).json({ error: "Failed to list", message: err.message }); }
});

router.get("/:id", async (req, res) => {
  try { const doc = await Activity.findById(req.params.id); if (!doc) return res.status(404).json({ error: "Not found" }); res.json(doc); }
  catch { res.status(400).json({ error: "Invalid id" }); }
});

router.put("/:id", async (req, res) => {
  try { const doc = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); if (!doc) return res.status(404).json({ error: "Not found" }); res.json(doc); }
  catch (err) { res.status(400).json({ error: "Failed to update", message: err.message }); }
});

router.delete("/:id", async (req, res) => {
  try { const doc = await Activity.findByIdAndDelete(req.params.id); if (!doc) return res.status(404).json({ error: "Not found" }); res.json({ message: "Deleted", deleted: doc }); }
  catch (err) { res.status(400).json({ error: "Failed to delete", message: err.message }); }
});

module.exports = router;


