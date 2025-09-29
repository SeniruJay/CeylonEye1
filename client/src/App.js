import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import axios from "axios";
import Auth from "./components/Auth";
import Homepage from "./components/Homepage";
import Services from "./components/Services";
import About from "./components/About";
import Contact from "./components/Contact";
import FAQs from "./components/FAQs";
import Accommodation from "./components/Accommodation";
import Locations from "./components/Locations";
import Activities from "./components/Activities";
import TransportList from "./components/TransportList";
import AdminDashboard from "./components/AdminDashboard";
import AdminAccommodations from "./components/admin/AdminAccommodations";
import AdminLocations from "./components/admin/AdminLocations";
import AdminActivities from "./components/admin/AdminActivities";
import AdminBookings from "./components/admin/AdminBookings";
import AddTransportProvider from "./components/AddTransportProvider";
import EditTransportProvider from "./components/EditTransportProvider";
import TransportBooking from "./components/TransportBooking";
import TransportDetail from "./components/TransportDetail";
import BookingFlow from "./components/BookingFlow";
import UserManagement from "./components/UserManagement";
import logo from "./assets/horizontal logo.png"; 

// CeylonEye Logo Component
export const CeylonEyeLogo = ({ size = "large" }) => {
  const logoSize = size === "large" ? "140px" : "80px";
  const textSize = size === "large" ? "2.8rem" : "1.8rem";

  return (
    <div style={{ textAlign: "center", marginBottom: "15px" }}>
      <div
        style={{
          width: logoSize,
          height: logoSize,
          margin: "0 auto 20px auto",
          position: "relative",
          transition: "transform 0.3s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <img
          src={logo}
          alt="CeylonEye Logo"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState(null);

  // Check for existing login on app start
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const openProfile = () => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    setProfileData({
      firstName: currentUser.firstName || "",
      lastName: currentUser.lastName || "",
      phone: currentUser.phone || "",
      address: {
        street: currentUser.address?.street || "",
        city: currentUser.address?.city || "",
        country: currentUser.address?.country || "Sri Lanka",
        postalCode: currentUser.address?.postalCode || "",
      },
      preferences: {
        language: currentUser.preferences?.language || "English",
        currency: currentUser.preferences?.currency || "USD",
        notifications: currentUser.preferences?.notifications !== false,
      },
    });
    setShowProfile(true);
  };

  const submitProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5000/api/auth/profile",
        profileData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.setItem("user", JSON.stringify(response.data));
      setUser(response.data);
      alert("Profile updated successfully!");
      setShowProfile(false);
    } catch (err) {
      alert("Failed to update profile");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f8fff8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2 style={{ color: "#4a7c59" }}>Loading...</h2>
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #0f0f23 100%)",
          backgroundSize: "400% 400%",
          animation: "gradientShift 20s ease infinite",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
        }}
      >
        <style>
          {`
            @keyframes gradientShift {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          `}
        </style>
        <header
          style={{
            backgroundColor: "rgba(15, 15, 35, 0.8)",
            backdropFilter: "blur(20px)",
            padding: "16px 0",
            marginBottom: "25px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            position: "sticky",
            top: 0,
            zIndex: 1000,
            border: "1px solid rgba(255, 255, 255, 0.05)",
            borderRadius: "0 0 20px 20px",
          }}
        >
          <div
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
              padding: "0 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Logo on the left */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "140px",
                  height: "80px",
                  marginRight: "24px",
                  position: "relative",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.filter = "drop-shadow(0 4px 12px rgba(74, 124, 89, 0.2))";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.filter = "none";
                }}
              >
                <img
                  src={logo}
                  alt="CeylonEye Logo"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
            {/* Navigation on the right */}
            <nav
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <Link
                to="/"
                style={{
                  padding: "12px 24px",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  color: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontWeight: "500",
                  textDecoration: "none",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden",
                  backdropFilter: "blur(10px)",
                  letterSpacing: "0.5px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.3)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                  e.currentTarget.style.color = "rgba(255, 255, 255, 0.9)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                }}
              >
                Home
              </Link>
              <Link
                to="/services"
                style={{
                  padding: "12px 24px",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  color: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontWeight: "500",
                  textDecoration: "none",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden",
                  backdropFilter: "blur(10px)",
                  letterSpacing: "0.5px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.3)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                  e.currentTarget.style.color = "rgba(255, 255, 255, 0.9)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                }}
              >
                Services
              </Link>
              <Link
                to="/about"
                style={{
                  padding: "12px 24px",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  color: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontWeight: "500",
                  textDecoration: "none",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden",
                  backdropFilter: "blur(10px)",
                  letterSpacing: "0.5px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.3)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                  e.currentTarget.style.color = "rgba(255, 255, 255, 0.9)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                }}
              >
                About
              </Link>
              <Link
                to="/contact"
                style={{
                  padding: "12px 24px",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  color: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontWeight: "500",
                  textDecoration: "none",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden",
                  backdropFilter: "blur(10px)",
                  letterSpacing: "0.5px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.3)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                  e.currentTarget.style.color = "rgba(255, 255, 255, 0.9)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                }}
              >
                Contact
              </Link>
              <Link
                to="/faqs"
                style={{
                  padding: "12px 24px",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  color: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontWeight: "500",
                  textDecoration: "none",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden",
                  backdropFilter: "blur(10px)",
                  letterSpacing: "0.5px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.3)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                  e.currentTarget.style.color = "rgba(255, 255, 255, 0.9)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                }}
              >
                FAQs
              </Link>
              <Link
                to="/booking"
                style={{
                  padding: "12px 24px",
                  backgroundColor: "rgba(74, 124, 89, 0.8)",
                  color: "white",
                  border: "1px solid rgba(74, 124, 89, 0.6)",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontWeight: "600",
                  textDecoration: "none",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0 4px 15px rgba(74, 124, 89, 0.3)",
                  position: "relative",
                  overflow: "hidden",
                  backdropFilter: "blur(10px)",
                  letterSpacing: "0.5px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(74, 124, 89, 0.4)";
                  e.currentTarget.style.backgroundColor = "rgba(74, 124, 89, 0.9)";
                  e.currentTarget.style.borderColor = "rgba(74, 124, 89, 0.8)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(74, 124, 89, 0.3)";
                  e.currentTarget.style.backgroundColor = "rgba(74, 124, 89, 0.8)";
                  e.currentTarget.style.borderColor = "rgba(74, 124, 89, 0.6)";
                }}
              >
                Book Now
              </Link>
              <button
                onClick={openProfile}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  color: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden",
                  backdropFilter: "blur(10px)",
                  letterSpacing: "0.5px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.3)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                  e.currentTarget.style.color = "rgba(255, 255, 255, 0.9)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                }}
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "rgba(220, 53, 69, 0.8)",
                  color: "white",
                  border: "1px solid rgba(220, 53, 69, 0.6)",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden",
                  backdropFilter: "blur(10px)",
                  letterSpacing: "0.5px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(220, 53, 69, 0.9)";
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(220, 53, 69, 0.4)";
                  e.currentTarget.style.borderColor = "rgba(220, 53, 69, 0.8)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(220, 53, 69, 0.8)";
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "rgba(220, 53, 69, 0.6)";
                }}
              >
                Logout
              </button>
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    color: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    fontSize: "15px",
                    fontWeight: "500",
                    textDecoration: "none",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    position: "relative",
                    overflow: "hidden",
                    backdropFilter: "blur(10px)",
                    letterSpacing: "0.5px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
                    e.currentTarget.style.color = "white";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.3)";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                    e.currentTarget.style.color = "rgba(255, 255, 255, 0.9)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                  }}
                >
                  Admin
                </Link>
              )}
            </nav>
          </div>
        </header>
        <main
          style={{ 
            maxWidth: "100%", 
            margin: "0", 
            padding: "0 40px",
            width: "100%"
          }}
        >
          <Routes>
            <Route
              path="/"
              element={<Homepage user={user} onLogout={handleLogout} />}
            />
            <Route path="/services" element={<Services />} />
            <Route path="/services/accommodation" element={<Accommodation />} />
            <Route path="/services/locations" element={<Locations />} />
            <Route path="/services/activities" element={<Activities />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/booking" element={<BookingFlow />} />
            <Route path="/transport" element={<TransportBooking />} />
            <Route
              path="/transport/provider/:id"
              element={<TransportDetail />}
            />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/transport" element={<TransportList />} />
            <Route
              path="/admin/accommodations"
              element={<AdminAccommodations />}
            />
            <Route path="/admin/locations" element={<AdminLocations />} />
            <Route path="/admin/activities" element={<AdminActivities />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/add" element={<AddTransportProvider />} />
            <Route path="/admin/edit/:id" element={<EditTransportProvider />} />
            <Route path="/admin/users" element={<UserManagement />} />
          </Routes>
        </main>
        {showProfile && profileData && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "20px",
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "15px",
                padding: "30px",
                width: "100%",
                maxWidth: "520px",
                maxHeight: "90vh",
                overflow: "auto",
              }}
            >
              <h2 style={{ color: "#2d5a27", marginBottom: "25px" }}>
                Edit Profile
              </h2>
              <form onSubmit={submitProfile}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "15px",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "600",
                        color: "#2d5a27",
                      }}
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          firstName: e.target.value,
                        })
                      }
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "2px solid #e8f5e8",
                        borderRadius: "6px",
                        fontSize: "14px",
                        boxSizing: "border-box",
                        transition: "border-color 0.3s ease",
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = "#4a7c59")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor = "#e8f5e8")
                      }
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "600",
                        color: "#2d5a27",
                      }}
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          lastName: e.target.value,
                        })
                      }
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "2px solid #e8f5e8",
                        borderRadius: "6px",
                        fontSize: "14px",
                        boxSizing: "border-box",
                        transition: "border-color 0.3s ease",
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = "#4a7c59")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor = "#e8f5e8")
                      }
                    />
                  </div>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "#2d5a27",
                    }}
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "2px solid #e8f5e8",
                      borderRadius: "6px",
                      fontSize: "14px",
                      boxSizing: "border-box",
                      transition: "border-color 0.3s ease",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "#4a7c59")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "#e8f5e8")
                    }
                  />
                </div>
                <div
                  style={{ display: "flex", gap: "10px", marginTop: "25px" }}
                >
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: "12px",
                      backgroundColor: "#4a7c59",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#3a6c49")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#4a7c59")
                    }
                  >
                    Update Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowProfile(false)}
                    style={{
                      flex: 1,
                      padding: "12px",
                      backgroundColor: "#6c757d",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#5a6268")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#6c757d")
                    }
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <footer
          style={{
            backgroundColor: "rgba(15, 15, 35, 0.8)",
            backdropFilter: "blur(20px)",
            color: "white",
            padding: "20px 0",
            marginTop: "40px",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 -8px 32px rgba(0, 0, 0, 0.3)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            borderRadius: "20px 20px 0 0",
          }}
        >
          <div
            style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 20px" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "15px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  marginRight: "15px",
                  position: "relative",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <img
                  src={logo}
                  alt="CeylonEye Logo"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
              <h3
                style={{
                  margin: "0",
                  fontSize: "1.4rem",
                  fontWeight: "bold",
                  color: "white",
                  letterSpacing: "1px",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                CEYLONEYE
              </h3>
            </div>
            <p
              style={{
                margin: "0",
                opacity: "0.9",
                fontSize: "1rem",
                textAlign: "center",
                color: "white",
                textShadow: "0 1px 2px rgba(0,0,0,0.3)",
              }}
            >
              © 2024 CeylonEye Tourism Management System
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
