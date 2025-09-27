const express = require("express");
const Accommodation = require("../models/Accommodation");
const Location = require("../models/Location");
const Activity = require("../models/Activity");
const AccommodationBooking = require("../models/AccommodationBooking");
const LocationBooking = require("../models/LocationBooking");
const ActivityBooking = require("../models/ActivityBooking");

const router = express.Router();

const generateBookingId = (prefix) => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${prefix}${timestamp}${random}`.toUpperCase();
};

// Accommodation booking
router.post("/accommodation", async (req, res) => {
  try {
    const { accommodationId, customerName, customerEmail, customerPhone, checkInDate, checkOutDate, guests, specialRequests } = req.body;
    if (!accommodationId || !customerName || !customerEmail || !customerPhone || !checkInDate || !checkOutDate || !guests) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const accom = await Accommodation.findById(accommodationId);
    if (!accom) return res.status(404).json({ error: "Accommodation not found" });
    const nights = Math.max(1, Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000*60*60*24)));
    const totalPrice = nights * accom.price;
    const booking = await AccommodationBooking.create({
      bookingId: generateBookingId("ACY"),
      accommodationId,
      accommodationName: accom.name,
      customerName, customerEmail, customerPhone,
      checkInDate: new Date(checkInDate),
      checkOutDate: new Date(checkOutDate),
      guests,
      specialRequests: specialRequests || "",
      totalPrice,
      status: 'pending'
    });
    res.status(201).json(booking);
  } catch (err) { res.status(500).json({ error: "Failed to book accommodation", message: err.message }); }
});

// Location booking (e.g., guided visit)
router.post("/location", async (req, res) => {
  try {
    const { locationId, customerName, customerEmail, customerPhone, visitDate, groupSize, specialRequests } = req.body;
    if (!locationId || !customerName || !customerEmail || !customerPhone || !visitDate || !groupSize) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const loc = await Location.findById(locationId);
    if (!loc) return res.status(404).json({ error: "Location not found" });
    const basePrice = 25; // simple placeholder
    const totalPrice = basePrice * Number(groupSize);
    const booking = await LocationBooking.create({
      bookingId: generateBookingId("LCY"),
      locationId,
      locationName: loc.name,
      customerName, customerEmail, customerPhone,
      visitDate: new Date(visitDate),
      groupSize,
      specialRequests: specialRequests || "",
      totalPrice,
      status: 'pending'
    });
    res.status(201).json(booking);
  } catch (err) { res.status(500).json({ error: "Failed to book location", message: err.message }); }
});

// Activity booking
router.post("/activity", async (req, res) => {
  try {
    const { activityId, customerName, customerEmail, customerPhone, scheduledDate, participants, specialRequests } = req.body;
    if (!activityId || !customerName || !customerEmail || !customerPhone || !scheduledDate || !participants) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const act = await Activity.findById(activityId);
    if (!act) return res.status(404).json({ error: "Activity not found" });
    const totalPrice = (act.price || 0) * Number(participants || 1);
    const booking = await ActivityBooking.create({
      bookingId: generateBookingId("ATY"),
      activityId,
      activityName: act.name,
      customerName, customerEmail, customerPhone,
      scheduledDate: new Date(scheduledDate),
      participants,
      specialRequests: specialRequests || "",
      totalPrice,
      status: 'pending'
    });
    res.status(201).json(booking);
  } catch (err) { res.status(500).json({ error: "Failed to book activity", message: err.message }); }
});

module.exports = router;


