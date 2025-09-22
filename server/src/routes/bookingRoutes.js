const express = require("express");
const Booking = require("../models/Booking");
const TransportProvider = require("../models/TransportProvider");
const { generateBookingPDF } = require("../services/pdfService");
const router = express.Router();

// Generate unique booking ID
const generateBookingId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `CEY${timestamp}${random}`.toUpperCase();
};

// Get all bookings (for admin)
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('providerId', 'name contact vehicleType')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ 
      error: "Failed to fetch bookings",
      message: err.message 
    });
  }
});

// Get single booking by ID
router.get("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('providerId', 'name contact vehicleType');
    
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    
    res.json(booking);
  } catch (err) {
    console.error("Error fetching booking:", err);
    if (err.name === 'CastError') {
      return res.status(400).json({ error: "Invalid booking ID" });
    }
    res.status(500).json({ 
      error: "Failed to fetch booking",
      message: err.message 
    });
  }
});

// Create new booking
router.post("/", async (req, res) => {
  try {
    const {
      providerId,
      customerName,
      customerEmail,
      customerPhone,
      pickupLocation,
      dropoffLocation,
      bookingDate,
      bookingTime,
      numberOfPassengers,
      specialRequests
    } = req.body;

    // Validate required fields
    if (!providerId || !customerName || !customerEmail || !customerPhone || 
        !pickupLocation || !dropoffLocation || !bookingDate || !bookingTime || 
        !numberOfPassengers) {
      return res.status(400).json({ 
        error: "Missing required fields",
        required: ["providerId", "customerName", "customerEmail", "customerPhone", 
                  "pickupLocation", "dropoffLocation", "bookingDate", "bookingTime", "numberOfPassengers"]
      });
    }

    // Get provider details
    const provider = await TransportProvider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ error: "Transport provider not found" });
    }

    // Check availability
    if (!provider.availability) {
      return res.status(400).json({ error: "Transport provider is not available" });
    }

    // Generate booking ID
    const bookingId = generateBookingId();

    // Calculate total price
    const totalPrice = provider.price * numberOfPassengers;

    // Create booking
    const booking = new Booking({
      bookingId,
      providerId,
      providerName: provider.name,
      vehicleType: provider.vehicleType,
      customerName,
      customerEmail,
      customerPhone,
      pickupLocation,
      dropoffLocation,
      bookingDate: new Date(bookingDate),
      bookingTime,
      numberOfPassengers,
      specialRequests: specialRequests || "",
      totalPrice,
      status: 'pending'
    });

    await booking.save();

    // Populate the response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('providerId', 'name contact vehicleType seats price priceUnit');

    res.status(201).json(populatedBooking);
  } catch (err) {
    console.error("Error creating booking:", err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: "Validation error",
        details: err.message 
      });
    }
    res.status(500).json({ 
      error: "Failed to create booking",
      message: err.message 
    });
  }
});

// Update booking status
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ 
        error: "Invalid status",
        validStatuses: ['pending', 'confirmed', 'cancelled']
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('providerId', 'name contact vehicleType');

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json(booking);
  } catch (err) {
    console.error("Error updating booking status:", err);
    if (err.name === 'CastError') {
      return res.status(400).json({ error: "Invalid booking ID" });
    }
    res.status(500).json({ 
      error: "Failed to update booking status",
      message: err.message 
    });
  }
});

// Generate PDF for booking
router.get("/:id/pdf", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('providerId', 'name contact vehicleType seats price priceUnit description');
    
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const pdfData = {
      bookingId: booking.bookingId,
      provider: booking.providerId,
      customer: {
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        customerPhone: booking.customerPhone,
        pickupLocation: booking.pickupLocation,
        dropoffLocation: booking.dropoffLocation,
        bookingDate: booking.bookingDate,
        bookingTime: booking.bookingTime,
        numberOfPassengers: booking.numberOfPassengers,
        specialRequests: booking.specialRequests
      },
      totalPrice: booking.totalPrice
    };

    const pdfBuffer = await generateBookingPDF(pdfData);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="booking-${booking.bookingId}.pdf"`);
    res.send(pdfBuffer);
    
  } catch (err) {
    console.error("Error generating PDF:", err);
    if (err.name === 'CastError') {
      return res.status(400).json({ error: "Invalid booking ID" });
    }
    res.status(500).json({ 
      error: "Failed to generate PDF",
      message: err.message 
    });
  }
});

// Delete booking
router.delete("/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    
    res.json({ 
      message: "Booking deleted successfully",
      deletedBooking: booking
    });
  } catch (err) {
    console.error("Error deleting booking:", err);
    if (err.name === 'CastError') {
      return res.status(400).json({ error: "Invalid booking ID" });
    }
    res.status(500).json({ 
      error: "Failed to delete booking",
      message: err.message 
    });
  }
});

module.exports = router;
