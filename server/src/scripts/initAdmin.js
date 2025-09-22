const mongoose = require("mongoose");
const User = require("../models/User");

const initAdmin = async () => {
  try {
    // Connect to MongoDB
    const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/tourism_management";
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: "admin" });
    
    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }

    // Create admin user
    const admin = new User({
      username: "admin",
      email: "admin@ceyloneye.com",
      password: "1234",
      firstName: "System",
      lastName: "Administrator",
      phone: "+94123456789",
      role: "admin",
      isActive: true,
      address: {
        street: "Admin Office",
        city: "Colombo",
        country: "Sri Lanka",
        postalCode: "00100"
      }
    });

    await admin.save();
    console.log("Admin user created successfully!");
    console.log("Username: admin");
    console.log("Password: 1234");

  } catch (error) {
    console.error("Error initializing admin:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Run the script
initAdmin();
