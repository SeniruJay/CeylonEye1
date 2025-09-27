const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'TransportProvider', required: true },
  providerName: { type: String, required: true },
  vehicleType: { type: String, required: true },
  // Associate booking to a user when available
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  pickupLocation: { type: String, required: true },
  dropoffLocation: { type: String, required: true },
  bookingDate: { type: Date, required: true },
  bookingTime: { type: String, required: true },
  numberOfPassengers: { type: Number, required: true },
  specialRequests: { type: String, default: "" },
  totalPrice: { type: Number, required: true },
  // Legacy overall status for backward compatibility
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  // New workflow fields
  userConfirmed: { type: Boolean, default: false },
  adminStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
  paymentAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
