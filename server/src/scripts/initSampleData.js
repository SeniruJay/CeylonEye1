const mongoose = require("mongoose");
const Location = require("../models/Location");
const Accommodation = require("../models/Accommodation");
const Activity = require("../models/Activity");
const TransportProvider = require("../models/TransportProvider");

const initSampleData = async () => {
  try {
    // Connect to MongoDB
    const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/tourism_management";
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Location.deleteMany({});
    await Accommodation.deleteMany({});
    await Activity.deleteMany({});
    await TransportProvider.deleteMany({});

    // Sample Locations
    const locations = [
      {
        name: "Sigiriya Rock Fortress",
        region: "Central Province",
        type: "Heritage",
        description: "Ancient rock fortress and UNESCO World Heritage site with stunning frescoes and panoramic views."
      },
      {
        name: "Ella",
        region: "Uva Province",
        type: "Hill Country",
        description: "Picturesque hill station known for its tea plantations, waterfalls, and scenic train rides."
      },
      {
        name: "Galle Fort",
        region: "Southern Province",
        type: "Heritage",
        description: "Historic Dutch colonial fort with charming streets, boutique shops, and ocean views."
      },
      {
        name: "Mirissa Beach",
        region: "Southern Province",
        type: "Beach",
        description: "Beautiful beach destination famous for whale watching and surfing."
      },
      {
        name: "Yala National Park",
        region: "Southern Province",
        type: "Wildlife",
        description: "Premier wildlife sanctuary home to leopards, elephants, and diverse bird species."
      },
      {
        name: "Kandy",
        region: "Central Province",
        type: "City",
        description: "Cultural capital with the Temple of the Tooth Relic and traditional Kandyan culture."
      },
      {
        name: "Nuwara Eliya",
        region: "Central Province",
        type: "Hill Country",
        description: "Cool hill station known as 'Little England' with tea plantations and colonial architecture."
      },
      {
        name: "Anuradhapura",
        region: "North Central Province",
        type: "Heritage",
        description: "Ancient capital with well-preserved ruins of ancient Sinhalese civilization."
      }
    ];

    // Sample Accommodations
    const accommodations = [
      {
        name: "Galle Face Hotel",
        type: "Hotel",
        city: "Colombo",
        price: 150,
        rating: 4.5,
        availability: true,
        description: "Historic luxury hotel with colonial charm and modern amenities."
      },
      {
        name: "Ella Rock View Villa",
        type: "Villa",
        city: "Ella",
        price: 80,
        rating: 4.2,
        availability: true,
        description: "Boutique villa with panoramic views of Ella Rock and surrounding hills."
      },
      {
        name: "Galle Fort Heritage Hotel",
        type: "Hotel",
        city: "Galle",
        price: 120,
        rating: 4.3,
        availability: true,
        description: "Restored colonial mansion within the historic Galle Fort."
      },
      {
        name: "Mirissa Beach Resort",
        type: "Resort",
        city: "Mirissa",
        price: 100,
        rating: 4.1,
        availability: true,
        description: "Beachfront resort with direct access to Mirissa Beach."
      },
      {
        name: "Kandy City Hotel",
        type: "Hotel",
        city: "Kandy",
        price: 70,
        rating: 4.0,
        availability: true,
        description: "Modern hotel in the heart of Kandy with lake views."
      },
      {
        name: "Hill Country Homestay",
        type: "Homestay",
        city: "Nuwara Eliya",
        price: 40,
        rating: 4.4,
        availability: true,
        description: "Cozy family-run homestay with authentic Sri Lankan hospitality."
      }
    ];

    // Sample Activities
    const activities = [
      {
        name: "Udawalawe Safari",
        category: "Wildlife",
        location: "Udawalawe",
        duration: "Half-day",
        price: 45,
        availability: true,
        description: "Elephant safari in Udawalawe National Park with experienced guides."
      },
      {
        name: "Whale Watching",
        category: "Water Sports",
        location: "Mirissa",
        duration: "Half-day",
        price: 60,
        availability: true,
        description: "Blue whale and dolphin watching tour in the Indian Ocean."
      },
      {
        name: "Sigiriya Rock Climb",
        category: "Adventure",
        location: "Sigiriya",
        duration: "3 hours",
        price: 30,
        availability: true,
        description: "Guided climb to the top of Sigiriya Rock Fortress with historical commentary."
      },
      {
        name: "Ella Rock Hike",
        category: "Adventure",
        location: "Ella",
        duration: "4 hours",
        price: 25,
        availability: true,
        description: "Scenic hiking trail to Ella Rock with breathtaking valley views."
      },
      {
        name: "Tea Plantation Tour",
        category: "Heritage",
        location: "Nuwara Eliya",
        duration: "2 hours",
        price: 20,
        availability: true,
        description: "Educational tour of tea plantations with tasting session."
      },
      {
        name: "Surfing Lessons",
        category: "Water Sports",
        location: "Mirissa",
        duration: "2 hours",
        price: 35,
        availability: true,
        description: "Beginner-friendly surfing lessons with professional instructors."
      },
      {
        name: "Cultural Dance Show",
        category: "Heritage",
        location: "Kandy",
        duration: "1 hour",
        price: 15,
        availability: true,
        description: "Traditional Kandyan dance performance with live music."
      },
      {
        name: "Hot Air Balloon Ride",
        category: "Adventure",
        location: "Sigiriya",
        duration: "1 hour",
        price: 200,
        availability: true,
        description: "Aerial view of Sigiriya and surrounding countryside at sunrise."
      }
    ];

    // Sample Transport Providers
    const transportProviders = [
      {
        name: "Luxury Car Service",
        contact: "+94123456789",
        vehicleType: "Car",
        availability: true,
        seats: 4,
        price: 80,
        currency: "USD",
        priceUnit: "per day",
        description: "Premium sedan with professional driver for city and intercity travel."
      },
      {
        name: "Family Van Tours",
        contact: "+94123456790",
        vehicleType: "Van",
        availability: true,
        seats: 8,
        price: 120,
        currency: "USD",
        priceUnit: "per day",
        description: "Comfortable van perfect for family groups and long-distance travel."
      },
      {
        name: "Budget Bus Service",
        contact: "+94123456791",
        vehicleType: "Bus",
        availability: true,
        seats: 25,
        price: 200,
        currency: "USD",
        priceUnit: "per day",
        description: "Economical bus service for large groups and budget travelers."
      },
      {
        name: "Adventure Motorcycle",
        contact: "+94123456792",
        vehicleType: "Motorcycle",
        availability: true,
        seats: 2,
        price: 40,
        currency: "USD",
        priceUnit: "per day",
        description: "Perfect for adventurous travelers exploring hill country roads."
      },
      {
        name: "Eco Tuk-tuk Tours",
        contact: "+94123456793",
        vehicleType: "Tuk-tuk",
        availability: true,
        seats: 3,
        price: 25,
        currency: "USD",
        priceUnit: "per day",
        description: "Traditional three-wheeler for short city tours and local exploration."
      }
    ];

    // Insert data
    await Location.insertMany(locations);
    console.log("✅ Sample locations created");

    await Accommodation.insertMany(accommodations);
    console.log("✅ Sample accommodations created");

    await Activity.insertMany(activities);
    console.log("✅ Sample activities created");

    await TransportProvider.insertMany(transportProviders);
    console.log("✅ Sample transport providers created");

    console.log("\n🎉 Sample data initialization completed successfully!");
    console.log("You can now test the booking system with realistic data.");

  } catch (error) {
    console.error("Error initializing sample data:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Run the script
initSampleData();
