const mongoose = require("mongoose");

const transportProviderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  vehicleType: { type: String, required: true },
  availability: { type: Boolean, default: true },
  seats: { type: Number, required: true, default: 4 },
  price: { type: Number, required: true, default: 0 },
  currency: { type: String, default: "USD", enum: ["LKR", "USD", "EUR", "GBP", "AUD", "CAD", "JPY", "INR"] },
  priceUnit: { type: String, default: "per day" },
  description: { type: String, default: "" },
  images: [{ type: String }], // Array of image URLs/paths
  // Keep the old image field for backward compatibility
  image: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("TransportProvider", transportProviderSchema);
