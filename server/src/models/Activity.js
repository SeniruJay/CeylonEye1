const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ["Wildlife", "Water Sports", "Heritage", "Adventure", "Other"], default: "Other" },
  location: { type: String, required: true },
  duration: { type: String, default: "" },
  price: { type: Number, default: 0 },
  availability: { type: Boolean, default: true },
  description: { type: String, default: "" },
  image: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Activity", activitySchema);


