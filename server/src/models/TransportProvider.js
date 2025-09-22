const mongoose = require("mongoose");

const transportProviderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  vehicleType: { type: String, required: true },
  availability: { type: Boolean, default: true },
  seats: { type: Number, required: true, default: 4 },
  price: { type: Number, required: true, default: 0 },
  priceUnit: { type: String, default: "per day" },
  description: { type: String, default: "" },
  image: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("TransportProvider", transportProviderSchema);
