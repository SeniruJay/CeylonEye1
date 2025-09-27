const mongoose = require("mongoose");

const locationBookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  locationName: { type: String, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  visitDate: { type: Date, required: true },
  groupSize: { type: Number, required: true },
  specialRequests: { type: String, default: "" },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model("LocationBooking", locationBookingSchema);


