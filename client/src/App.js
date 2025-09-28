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
          backgroundColor: "#f8fff8",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
        }}
      >
        <header
          style={{
            backgroundColor: "white",
            padding: "20px 0",
            marginBottom: "25px",
            boxShadow: "0 2px 8px rgba(45, 90, 39, 0.1)",
            borderBottom: "2px solid #4a7c59",
          }}
        >
          <div
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
              padding: "0 20px",
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
                  marginRight: "20px",
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
            </div>
            {/* Navigation on the right */}
            <nav
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <Link
                to="/"
                style={{
                  padding: "8px 16px",
                  backgroundColor: "transparent",
                  color: "#4a7c59",
                  border: "2px solid #4a7c59",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: "600",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#4a7c59";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#4a7c59";
                }}
              >
                🏠 Home
              </Link>
              <Link
                to="/services"
                style={{
                  padding: "8px 16px",
                  backgroundColor: "transparent",
                  color: "#4a7c59",
                  border: "2px solid #4a7c59",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: "600",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#4a7c59";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#4a7c59";
                }}
              >
                🧭 Services
              </Link>
              <Link
                to="/about"
                style={{
                  padding: "8px 16px",
                  backgroundColor: "transparent",
                  color: "#4a7c59",
                  border: "2px solid #4a7c59",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: "600",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#4a7c59";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#4a7c59";
                }}
              >
                🏝️ About
              </Link>
              <Link
                to="/contact"
                style={{
                  padding: "8px 16px",
                  backgroundColor: "transparent",
                  color: "#4a7c59",
                  border: "2px solid #4a7c59",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: "600",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#4a7c59";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#4a7c59";
                }}
              >
                ✉️ Contact
              </Link>
              <Link
                to="/faqs"
                style={{
                  padding: "8px 16px",
                  backgroundColor: "transparent",
                  color: "#4a7c59",
                  border: "2px solid #4a7c59",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: "600",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#4a7c59";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#4a7c59";
                }}
              >
                ❓ FAQs
              </Link>
              <Link
                to="/booking"
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#4a7c59",
                  color: "white",
                  border: "2px solid #4a7c59",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: "600",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#3a6c49")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#4a7c59")
                }
              >
                📋 Book Now
              </Link>
              <button
                onClick={openProfile}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#4a7c59",
                  color: "white",
                  border: "none",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#3a6c49")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#4a7c59")
                }
              >
                👤 Edit Profile
              </button>
              <button
                onClick={handleLogout}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#c82333")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#dc3545")
                }
              >
                🚪 Logout
              </button>
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "transparent",
                    color: "#dc3545",
                    border: "2px solid #dc3545",
                    borderRadius: "20px",
                    fontSize: "14px",
                    fontWeight: "600",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#dc3545";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#dc3545";
                  }}
                >
                  ⚙️ Admin
                </Link>
              )}
            </nav>
          </div>
        </header>
        <main
          style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 20px" }}
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
            backgroundColor: "white",
            color: "#4a7c59",
            padding: "20px 0",
            marginTop: "40px",
            borderTop: "2px solid #4a7c59",
            boxShadow: "0 -2px 8px rgba(45, 90, 39, 0.1)",
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
                  color: "#2d5a27",
                  letterSpacing: "1px",
                }}
              >
                CEYLONEYE
              </h3>
            </div>
            <p
              style={{
                margin: "0",
                opacity: "0.8",
                fontSize: "1rem",
                textAlign: "center",
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
