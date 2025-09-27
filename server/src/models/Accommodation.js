const mongoose = require("mongoose");

const accommodationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["Hotel", "Villa", "Homestay", "Hostel", "Resort", "Other"], default: "Hotel" },
  city: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  availability: { type: Boolean, default: true },
  description: { type: String, default: "" },
  image: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Accommodation", accommodationSchema);


