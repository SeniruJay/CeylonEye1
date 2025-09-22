import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Auth from "./components/Auth";
import Homepage from "./components/Homepage";
import TransportList from "./components/TransportList";
import AddTransportProvider from "./components/AddTransportProvider";
import EditTransportProvider from "./components/EditTransportProvider";
import TransportBooking from "./components/TransportBooking";
import UserManagement from "./components/UserManagement";

// CeylonEye Logo Component
const CeylonEyeLogo = ({ size = "large" }) => {
  const logoSize = size === "large" ? "120px" : "60px";
  const textSize = size === "large" ? "2.5rem" : "1.5rem";
  
  return (
    <div style={{ textAlign: "center", marginBottom: "10px" }}>
      <div style={{ 
        width: logoSize, 
        height: logoSize, 
        margin: "0 auto 15px auto",
        position: "relative"
      }}>
        {/* Sri Lanka Outline */}
        <svg width={logoSize} height={logoSize} viewBox="0 0 100 100" style={{ position: "absolute", top: 0, left: 0 }}>
          {/* Sri Lanka Island Shape */}
          <path
            d="M20 30 L25 25 L35 20 L45 18 L55 20 L65 25 L75 30 L80 35 L82 45 L80 55 L75 65 L70 70 L60 75 L50 78 L40 75 L30 70 L25 65 L22 55 L20 45 Z"
            fill="none"
            stroke="#2d5a27"
            strokeWidth="3"
          />
          {/* Mountains */}
          <path
            d="M30 45 L35 40 L40 42 L45 38 L50 40 L55 35 L60 37 L65 40"
            fill="none"
            stroke="#2d5a27"
            strokeWidth="1.5"
          />
          {/* Palm Trees */}
          <path
            d="M35 60 L35 70 M32 65 L38 65 M33 62 L37 62"
            fill="none"
            stroke="#2d5a27"
            strokeWidth="1.5"
          />
          <path
            d="M45 65 L45 72 M42 68 L48 68 M43 66 L47 66"
            fill="none"
            stroke="#2d5a27"
            strokeWidth="1.5"
          />
          {/* Water lines */}
          <path
            d="M25 75 Q30 73 35 75 Q40 77 45 75 Q50 73 55 75 Q60 77 65 75 Q70 73 75 75"
            fill="none"
            stroke="#2d5a27"
            strokeWidth="1"
          />
        </svg>
      </div>
      <h1 style={{ 
        margin: "0", 
        fontSize: textSize, 
        fontWeight: "bold",
        color: "#2d5a27",
        letterSpacing: "2px"
      }}>
        CEYLONEYE
      </h1>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        backgroundColor: "#f8fff8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <h2 style={{ color: "#4a7c59" }}>Loading...</h2>
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div style={{ 
        minHeight: "100vh", 
        backgroundColor: "#f8fff8",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif"
      }}>
        <header style={{
          backgroundColor: "white",
          padding: "15px 0",
          marginBottom: "20px",
          boxShadow: "0 2px 8px rgba(45, 90, 39, 0.1)",
          borderBottom: "2px solid #4a7c59"
        }}>
          <div style={{ 
            maxWidth: "1200px", 
            margin: "0 auto", 
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            {/* Logo on the left */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ 
                width: "50px", 
                height: "50px", 
                marginRight: "15px",
                position: "relative"
              }}>
                <svg width="50" height="50" viewBox="0 0 100 100" style={{ position: "absolute", top: 0, left: 0 }}>
                  <path
                    d="M20 30 L25 25 L35 20 L45 18 L55 20 L65 25 L75 30 L80 35 L82 45 L80 55 L75 65 L70 70 L60 75 L50 78 L40 75 L30 70 L25 65 L22 55 L20 45 Z"
                    fill="none"
                    stroke="#2d5a27"
                    strokeWidth="3"
                  />
                  <path
                    d="M30 45 L35 40 L40 42 L45 38 L50 40 L55 35 L60 37 L65 40"
                    fill="none"
                    stroke="#2d5a27"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M35 60 L35 70 M32 65 L38 65 M33 62 L37 62"
                    fill="none"
                    stroke="#2d5a27"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M45 65 L45 72 M42 68 L48 68 M43 66 L47 66"
                    fill="none"
                    stroke="#2d5a27"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M25 75 Q30 73 35 75 Q40 77 45 75 Q50 73 55 75 Q60 77 65 75 Q70 73 75 75"
                    fill="none"
                    stroke="#2d5a27"
                    strokeWidth="1"
                  />
                </svg>
              </div>
              <h1 style={{ 
                margin: "0", 
                fontSize: "1.8rem", 
                fontWeight: "bold",
                color: "#2d5a27",
                letterSpacing: "1px"
              }}>
                CEYLONEYE
              </h1>
            </div>

            {/* Navigation on the right */}
            <nav style={{ display: "flex", gap: "15px" }}>
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
                  transition: "all 0.3s ease"
                }}
              >
                🏠 Home
              </Link>
              <Link
                to="/transport"
                style={{
                  padding: "8px 16px",
                  backgroundColor: "transparent",
                  color: "#4a7c59",
                  border: "2px solid #4a7c59",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: "600",
                  textDecoration: "none",
                  transition: "all 0.3s ease"
                }}
              >
                🚗 Transport
              </Link>
              {user.role === 'admin' && (
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
                    transition: "all 0.3s ease"
                  }}
                >
                  ⚙️ Admin
                </Link>
              )}
            </nav>
          </div>
        </header>

        <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
          <Routes>
            <Route path="/" element={<Homepage user={user} onLogout={handleLogout} />} />
            <Route path="/transport" element={<TransportBooking />} />
            <Route path="/admin" element={<TransportList />} />
            <Route path="/admin/add" element={<AddTransportProvider />} />
            <Route path="/admin/edit/:id" element={<EditTransportProvider />} />
            <Route path="/admin/users" element={<UserManagement />} />
          </Routes>
        </main>

        <footer style={{
          backgroundColor: "white",
          color: "#4a7c59",
          textAlign: "center",
          padding: "20px 0",
          marginTop: "40px",
          borderTop: "2px solid #4a7c59",
          boxShadow: "0 -2px 8px rgba(45, 90, 39, 0.1)"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
            <div style={{ 
              width: "30px", 
              height: "30px", 
              marginRight: "10px",
              position: "relative"
            }}>
              <svg width="30" height="30" viewBox="0 0 100 100" style={{ position: "absolute", top: 0, left: 0 }}>
                <path
                  d="M20 30 L25 25 L35 20 L45 18 L55 20 L65 25 L75 30 L80 35 L82 45 L80 55 L75 65 L70 70 L60 75 L50 78 L40 75 L30 70 L25 65 L22 55 L20 45 Z"
                  fill="none"
                  stroke="#2d5a27"
                  strokeWidth="3"
                />
                <path
                  d="M30 45 L35 40 L40 42 L45 38 L50 40 L55 35 L60 37 L65 40"
                  fill="none"
                  stroke="#2d5a27"
                  strokeWidth="1.5"
                />
                <path
                  d="M35 60 L35 70 M32 65 L38 65 M33 62 L37 62"
                  fill="none"
                  stroke="#2d5a27"
                  strokeWidth="1.5"
                />
                <path
                  d="M45 65 L45 72 M42 68 L48 68 M43 66 L47 66"
                  fill="none"
                  stroke="#2d5a27"
                  strokeWidth="1.5"
                />
                <path
                  d="M25 75 Q30 73 35 75 Q40 77 45 75 Q50 73 55 75 Q60 77 65 75 Q70 73 75 75"
                  fill="none"
                  stroke="#2d5a27"
                  strokeWidth="1"
                />
              </svg>
            </div>
            <h3 style={{ 
              margin: "0", 
              fontSize: "1.2rem", 
              fontWeight: "bold",
              color: "#2d5a27",
              letterSpacing: "1px"
            }}>
              CEYLONEYE
            </h3>
          </div>
          <p style={{ margin: "0", opacity: "0.8", fontSize: "0.9rem" }}>
            © 2024 CeylonEye Tourism Management System
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
