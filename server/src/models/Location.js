const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  region: { type: String, required: true },
  type: { type: String, enum: ["Beach", "Hill Country", "Heritage", "Wildlife", "City", "Other"], default: "Other" },
  description: { type: String, default: "" },
  image: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Location", locationSchema);


