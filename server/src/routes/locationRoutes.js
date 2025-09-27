const express = require("express");
const Location = require("../models/Location");
const router = express.Router();

router.post("/", async (req, res) => {
  try { const doc = await Location.create(req.body); res.status(201).json(doc); }
  catch (err) { res.status(400).json({ error: "Failed to create", message: err.message }); }
});

router.get("/", async (req, res) => {
  try {
    const { q, region, type } = req.query;
    const filter = {};
    if (q) filter.name = { $regex: q, $options: "i" };
    if (region) filter.region = region;
    if (type) filter.type = type;
    const docs = await Location.find(filter).sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) { res.status(500).json({ error: "Failed to list", message: err.message }); }
});

router.get("/:id", async (req, res) => {
  try { const doc = await Location.findById(req.params.id); if (!doc) return res.status(404).json({ error: "Not found" }); res.json(doc); }
  catch { res.status(400).json({ error: "Invalid id" }); }
});

router.put("/:id", async (req, res) => {
  try { const doc = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); if (!doc) return res.status(404).json({ error: "Not found" }); res.json(doc); }
  catch (err) { res.status(400).json({ error: "Failed to update", message: err.message }); }
});

router.delete("/:id", async (req, res) => {
  try { const doc = await Location.findByIdAndDelete(req.params.id); if (!doc) return res.status(404).json({ error: "Not found" }); res.json({ message: "Deleted", deleted: doc }); }
  catch (err) { res.status(400).json({ error: "Failed to delete", message: err.message }); }
});

module.exports = router;


