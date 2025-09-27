const mongoose = require("mongoose");

const activityBookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  activityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', required: true },
  activityName: { type: String, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  scheduledDate: { type: Date, required: true },
  participants: { type: Number, required: true },
  specialRequests: { type: String, default: "" },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model("ActivityBooking", activityBookingSchema);


