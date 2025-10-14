const express = require("express");
const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const TransportProvider = require("../models/TransportProvider");
const AccommodationBooking = require("../models/AccommodationBooking");
const LocationBooking = require("../models/LocationBooking");
const ActivityBooking = require("../models/ActivityBooking");
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

// Get ALL booking types for admin (transport + accommodation + location + activity)
router.get("/all", async (req, res) => {
  try {
    const [transport, accommodations, locations, activities] = await Promise.all([
      Booking.find().populate('providerId', 'name contact vehicleType').lean(),
      AccommodationBooking.find().lean(),
      LocationBooking.find().lean(),
      ActivityBooking.find().lean(),
    ]);

    const currency = 'LKR';

    const normalizeTransport = transport.map((b) => ({
      ...b,
      type: 'transport',
      providerName: b.providerName,
      currency: b.currency || currency,
    }));

    const normalizeAccom = accommodations.map((b) => ({
      _id: b._id,
      bookingId: b.bookingId,
      customerName: b.customerName,
      customerEmail: b.customerEmail,
      customerPhone: b.customerPhone,
      providerName: b.accommodationName,
      totalPrice: b.totalPrice,
      status: b.status,
      adminStatus: 'n/a',
      userConfirmed: false,
      paymentStatus: 'n/a',
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
      type: 'accommodation',
      currency,
    }));

    const normalizeLocations = locations.map((b) => ({
      _id: b._id,
      bookingId: b.bookingId,
      customerName: b.customerName,
      customerEmail: b.customerEmail,
      customerPhone: b.customerPhone,
      providerName: b.locationName,
      totalPrice: b.totalPrice,
      status: b.status,
      adminStatus: 'n/a',
      userConfirmed: false,
      paymentStatus: 'n/a',
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
      type: 'location',
      currency,
    }));

    const normalizeActivities = activities.map((b) => ({
      _id: b._id,
      bookingId: b.bookingId,
      customerName: b.customerName,
      customerEmail: b.customerEmail,
      customerPhone: b.customerPhone,
      providerName: b.activityName,
      totalPrice: b.totalPrice,
      status: b.status,
      adminStatus: 'n/a',
      userConfirmed: false,
      paymentStatus: 'n/a',
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
      type: 'activity',
      currency,
    }));

    const all = [
      ...normalizeTransport,
      ...normalizeAccom,
      ...normalizeLocations,
      ...normalizeActivities,
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(all);
  } catch (err) {
    console.error("Error fetching all bookings:", err);
    res.status(500).json({ error: "Failed to fetch bookings", message: err.message });
  }
});

// Get ALL booking types for a specific user (transport + accommodation + location + activity)
router.get("/all/by-user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }
    const uid = new mongoose.Types.ObjectId(userId);

    const [transport, accommodations, locations, activities] = await Promise.all([
      Booking.find({ userId: uid }).populate('providerId', 'name contact vehicleType').lean(),
      AccommodationBooking.find({ userId: uid }).lean(),
      LocationBooking.find({ userId: uid }).lean(),
      ActivityBooking.find({ userId: uid }).lean(),
    ]);

    const currency = 'LKR';

    const normalizeTransport = transport.map((b) => ({
      ...b,
      type: 'transport',
      providerName: b.providerName,
      currency: b.currency || currency,
    }));

    const normalizeAccom = accommodations.map((b) => ({
      _id: b._id,
      bookingId: b.bookingId,
      customerName: b.customerName,
      customerEmail: b.customerEmail,
      customerPhone: b.customerPhone,
      providerName: b.accommodationName,
      totalPrice: b.totalPrice,
      status: b.status,
      adminStatus: 'n/a',
      userConfirmed: false,
      paymentStatus: 'n/a',
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
      type: 'accommodation',
      currency,
    }));

    const normalizeLocations = locations.map((b) => ({
      _id: b._id,
      bookingId: b.bookingId,
      customerName: b.customerName,
      customerEmail: b.customerEmail,
      customerPhone: b.customerPhone,
      providerName: b.locationName,
      totalPrice: b.totalPrice,
      status: b.status,
      adminStatus: 'n/a',
      userConfirmed: false,
      paymentStatus: 'n/a',
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
      type: 'location',
      currency,
    }));

    const normalizeActivities = activities.map((b) => ({
      _id: b._id,
      bookingId: b.bookingId,
      customerName: b.customerName,
      customerEmail: b.customerEmail,
      customerPhone: b.customerPhone,
      providerName: b.activityName,
      totalPrice: b.totalPrice,
      status: b.status,
      adminStatus: 'n/a',
      userConfirmed: false,
      paymentStatus: 'n/a',
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
      type: 'activity',
      currency,
    }));

    const all = [
      ...normalizeTransport,
      ...normalizeAccom,
      ...normalizeLocations,
      ...normalizeActivities,
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(all);
  } catch (err) {
    console.error("Error fetching all bookings for user:", err);
    res.status(500).json({ error: "Failed to fetch user bookings", message: err.message });
  }
});

// Get bookings by userId (for user)
router.get("/by-user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ userId })
      .populate('providerId', 'name contact vehicleType')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching user bookings:", err);
    res.status(500).json({ error: "Failed to fetch user bookings", message: err.message });
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

// Create comprehensive booking (new booking flow)
router.post("/comprehensive", async (req, res) => {
  try {
    const {
      locations,
      transport,
      accommodations,
      activities,
      payment,
      userId,
      bookingDate,
      status
    } = req.body;

    // Generate booking ID
    const bookingId = generateBookingId();

    // Calculate total price
    let totalPrice = 0;
    
    // Transport cost (assuming 3 days)
    if (transport) {
      totalPrice += transport.price * 3;
    }
    
    // Accommodation cost (assuming 3 nights)
    if (accommodations && accommodations.length > 0) {
      totalPrice += accommodations.reduce((sum, acc) => sum + acc.price, 0) * 3;
    }
    
    // Activity costs
    if (activities && activities.length > 0) {
      totalPrice += activities.reduce((sum, act) => sum + act.price, 0);
    }

    // Create comprehensive booking
    const booking = new Booking({
      bookingId,
      providerId: transport ? transport._id : null,
      providerName: transport ? transport.name : "Comprehensive Package",
      vehicleType: transport ? transport.vehicleType : "Package",
      userId: userId || null,
      customerName: payment.name,
      customerEmail: payment.email,
      customerPhone: payment.phone,
      pickupLocation: "Sri Lanka Tour",
      dropoffLocation: "Sri Lanka Tour",
      bookingDate: new Date(bookingDate),
      bookingTime: "Full Day",
      numberOfPassengers: 1,
      specialRequests: `Comprehensive booking including: ${locations?.length || 0} locations, ${accommodations?.length || 0} accommodations, ${activities?.length || 0} activities`,
      totalPrice,
      status: status || 'pending',
      userConfirmed: true,
      adminStatus: 'pending',
      paymentStatus: 'unpaid',
      // Store additional data in specialRequests for now (could be extended with a new schema)
      comprehensiveData: {
        locations: locations || [],
        transport: transport || null,
        accommodations: accommodations || [],
        activities: activities || [],
        payment: payment || {}
      }
    });

    await booking.save();

    res.status(201).json({
      _id: booking._id,
      bookingId: booking.bookingId,
      message: "Comprehensive booking created successfully",
      totalPrice: booking.totalPrice,
      status: booking.status
    });
  } catch (err) {
    console.error("Error creating comprehensive booking:", err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: "Validation error",
        details: err.message 
      });
    }
    res.status(500).json({ 
      error: "Failed to create comprehensive booking",
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
      status: 'pending',
      userId: req.body.userId || null
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

// User confirms a booking (moving it to awaiting admin approval)
router.put('/:id/confirm', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { userConfirmed: true, adminStatus: 'pending', status: 'pending' },
      { new: true }
    );
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    console.error('Error confirming booking:', err);
    res.status(500).json({ error: 'Failed to confirm booking', message: err.message });
  }
});

// Admin approves a confirmed booking
router.put('/:id/approve', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { adminStatus: 'approved', status: 'confirmed' },
      { new: true }
    );
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    console.error('Error approving booking:', err);
    res.status(500).json({ error: 'Failed to approve booking', message: err.message });
  }
});

// Admin rejects a confirmed booking
router.put('/:id/reject', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { adminStatus: 'rejected', status: 'cancelled' },
      { new: true }
    );
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    console.error('Error rejecting booking:', err);
    res.status(500).json({ error: 'Failed to reject booking', message: err.message });
  }
});

// Mark a booking as paid (user payment after admin approves)
router.put('/:id/pay', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.adminStatus !== 'approved') {
      return res.status(400).json({ error: 'Booking must be approved by admin before payment' });
    }
    booking.paymentStatus = 'paid';
    booking.paymentAt = new Date();
    await booking.save();
    res.json(booking);
  } catch (err) {
    console.error('Error marking booking paid:', err);
    res.status(500).json({ error: 'Failed to mark booking as paid', message: err.message });
  }
});

// Calculate total price of all bookings for a user
router.get('/total/by-user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid userId' });
    }
    const result = await Booking.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const total = result[0]?.total || 0;
    res.json({ userId, total });
  } catch (err) {
    console.error('Error calculating total:', err);
    res.status(500).json({ error: 'Failed to calculate total', message: err.message });
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
