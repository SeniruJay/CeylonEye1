import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Homepage = ({ user, onLogout }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    phone: user.phone || "",
    address: {
      street: user.address?.street || "",
      city: user.address?.city || "",
      country: user.address?.country || "Sri Lanka",
      postalCode: user.address?.postalCode || ""
    },
    preferences: {
      language: user.preferences?.language || "English",
      currency: user.preferences?.currency || "USD",
      notifications: user.preferences?.notifications !== false
    }
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5000/api/auth/profile",
        profileData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      alert("Profile updated successfully!");
      setShowProfile(false);
    } catch (err) {
      alert("Failed to update profile");
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    onLogout();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const getVehicleIcon = (type) => {
    const icons = {
      'Car': '🚗',
      'Van': '🚐',
      'Bus': '🚌',
      'Motorcycle': '🏍️',
      'Bicycle': '🚲',
      'Tuk-tuk': '🛺',
      'Other': '🚙'
    };
    return icons[type] || '🚙';
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Welcome Section */}
      <div style={{
        backgroundColor: "white",
        borderRadius: "15px",
        padding: "30px",
        marginBottom: "30px",
        boxShadow: "0 4px 12px rgba(74, 124, 89, 0.15)",
        border: "1px solid #e8f5e8"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ 
              margin: "0 0 10px 0", 
              color: "#2d5a27", 
              fontSize: "2.5rem",
              fontWeight: "300"
            }}>
              {getGreeting()}, {user.firstName}! 👋
            </h1>
            <p style={{ 
              margin: "0", 
              color: "#4a7c59", 
              fontSize: "1.2rem" 
            }}>
              Welcome to CeylonEye Tourism Management System
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => setShowProfile(true)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#4a7c59",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
            >
              👤 Edit Profile
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: "10px 20px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "25px",
        marginBottom: "30px"
      }}>
        {/* Transport */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "15px",
          padding: "30px",
          boxShadow: "0 4px 12px rgba(74, 124, 89, 0.15)",
          border: "1px solid #e8f5e8",
          textAlign: "center",
          transition: "transform 0.3s ease, box-shadow 0.3s ease"
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.boxShadow = "0 8px 20px rgba(74, 124, 89, 0.2)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(74, 124, 89, 0.15)";
        }}>
          <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🚗</div>
          <h3 style={{ color: "#2d5a27", marginBottom: "15px", fontSize: "1.5rem" }}>
            Transport Services
          </h3>
          <p style={{ color: "#666", marginBottom: "25px", lineHeight: "1.6" }}>
            Book your transportation needs with our reliable transport providers
          </p>
          <Link
            to="/transport"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              backgroundColor: "#4a7c59",
              color: "white",
              textDecoration: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              transition: "all 0.3s ease"
            }}
          >
            Book Transport
          </Link>
        </div>

        {/* Accommodation */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "15px",
          padding: "30px",
          boxShadow: "0 4px 12px rgba(74, 124, 89, 0.15)",
          border: "1px solid #e8f5e8",
          textAlign: "center",
          transition: "transform 0.3s ease, box-shadow 0.3s ease"
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.boxShadow = "0 8px 20px rgba(74, 124, 89, 0.2)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(74, 124, 89, 0.15)";
        }}>
          <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🏨</div>
          <h3 style={{ color: "#2d5a27", marginBottom: "15px", fontSize: "1.5rem" }}>
            Accommodation
          </h3>
          <p style={{ color: "#666", marginBottom: "25px", lineHeight: "1.6" }}>
            Find and book the perfect place to stay during your visit
          </p>
          <button
            style={{
              padding: "12px 24px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "not-allowed"
            }}
            disabled
          >
            Coming Soon
          </button>
        </div>

        {/* Locations */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "15px",
          padding: "30px",
          boxShadow: "0 4px 12px rgba(74, 124, 89, 0.15)",
          border: "1px solid #e8f5e8",
          textAlign: "center",
          transition: "transform 0.3s ease, box-shadow 0.3s ease"
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.boxShadow = "0 8px 20px rgba(74, 124, 89, 0.2)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(74, 124, 89, 0.15)";
        }}>
          <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🗺️</div>
          <h3 style={{ color: "#2d5a27", marginBottom: "15px", fontSize: "1.5rem" }}>
            Tourist Locations
          </h3>
          <p style={{ color: "#666", marginBottom: "25px", lineHeight: "1.6" }}>
            Discover amazing places to visit in Sri Lanka
          </p>
          <button
            style={{
              padding: "12px 24px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "not-allowed"
            }}
            disabled
          >
            Coming Soon
          </button>
        </div>

        {/* Leisure Activities */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "15px",
          padding: "30px",
          boxShadow: "0 4px 12px rgba(74, 124, 89, 0.15)",
          border: "1px solid #e8f5e8",
          textAlign: "center",
          transition: "transform 0.3s ease, box-shadow 0.3s ease"
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.boxShadow = "0 8px 20px rgba(74, 124, 89, 0.2)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(74, 124, 89, 0.15)";
        }}>
          <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🎯</div>
          <h3 style={{ color: "#2d5a27", marginBottom: "15px", fontSize: "1.5rem" }}>
            Leisure Activities
          </h3>
          <p style={{ color: "#666", marginBottom: "25px", lineHeight: "1.6" }}>
            Explore exciting activities and experiences
          </p>
          <button
            style={{
              padding: "12px 24px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "not-allowed"
            }}
            disabled
          >
            Coming Soon
          </button>
        </div>
      </div>

      {/* Admin Panel Link (Admin Only) */}
      {user.role === 'admin' && (
        <div style={{
          backgroundColor: "white",
          borderRadius: "15px",
          padding: "30px",
          boxShadow: "0 4px 12px rgba(74, 124, 89, 0.15)",
          border: "1px solid #e8f5e8",
          textAlign: "center"
        }}>
          <h3 style={{ color: "#2d5a27", marginBottom: "15px" }}>
            ⚙️ Admin Panel
          </h3>
          <p style={{ color: "#666", marginBottom: "25px" }}>
            Manage transport providers and users
          </p>
          <Link
            to="/admin"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              backgroundColor: "#dc3545",
              color: "white",
              textDecoration: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              transition: "all 0.3s ease"
            }}
          >
            Go to Admin Panel
          </Link>
        </div>
      )}

      {/* Profile Modal */}
      {showProfile && (
        <div style={{
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
          padding: "20px"
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: "15px",
            padding: "30px",
            width: "100%",
            maxWidth: "500px",
            maxHeight: "90vh",
            overflow: "auto"
          }}>
            <h2 style={{ color: "#2d5a27", marginBottom: "25px" }}>
              Edit Profile
            </h2>
            
            <form onSubmit={handleProfileUpdate}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2d5a27" }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "2px solid #e8f5e8",
                      borderRadius: "6px",
                      fontSize: "14px",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2d5a27" }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "2px solid #e8f5e8",
                      borderRadius: "6px",
                      fontSize: "14px",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2d5a27" }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "2px solid #e8f5e8",
                    borderRadius: "6px",
                    fontSize: "14px",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "25px" }}>
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
                    cursor: "pointer"
                  }}
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
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;
