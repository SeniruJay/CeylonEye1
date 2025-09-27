const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

const transportRoutes = require("./src/routes/transportRoutes");
const bookingRoutes = require("./src/routes/bookingRoutes");
const accommodationRoutes = require("./src/routes/accommodationRoutes");
const locationRoutes = require("./src/routes/locationRoutes");
const activityRoutes = require("./src/routes/activityRoutes");
const bookingExtraRoutes = require("./src/routes/bookingExtraRoutes");
const userRoutes = require("./src/routes/userRoutes");
const { router: authRoutes } = require("./src/routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transport-providers", transportRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/accommodations", accommodationRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/bookings-extra", bookingExtraRoutes);

app.use("/api/users", userRoutes);



// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/tourism_management";
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
