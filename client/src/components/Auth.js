import React, { useState } from "react";
import axios from "axios";

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [loginForm, setLoginForm] = useState({
    username: "",
    password: ""
  });

  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: ""
  });

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        ...loginForm,
        role: isAdmin ? "admin" : "user"
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      onLogin(response.data.user);

    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (registerForm.password !== registerForm.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        ...registerForm,
        role: isAdmin ? "admin" : "user"
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      onLogin(response.data.user);

    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f8fff8",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: "15px",
        boxShadow: "0 8px 32px rgba(74, 124, 89, 0.15)",
        padding: "40px",
        width: "100%",
        maxWidth: "450px",
        border: "1px solid #e8f5e8"
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ 
            width: "80px", 
            height: "80px", 
            margin: "0 auto 15px auto",
            position: "relative"
          }}>
            <svg width="80" height="80" viewBox="0 0 100 100" style={{ position: "absolute", top: 0, left: 0 }}>
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
            fontSize: "2rem", 
            fontWeight: "bold",
            color: "#2d5a27",
            letterSpacing: "2px"
          }}>
            CEYLONEYE
          </h1>
          <p style={{ color: "#4a7c59", margin: "5px 0 0 0" }}>
            Tourism Management System
          </p>
        </div>

        {/* Toggle Buttons */}
        <div style={{ 
          display: "flex", 
          marginBottom: "30px",
          backgroundColor: "#f0f7f0",
          borderRadius: "8px",
          padding: "4px"
        }}>
          <button
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: "12px",
              border: "none",
              borderRadius: "6px",
              backgroundColor: isLogin ? "#4a7c59" : "transparent",
              color: isLogin ? "white" : "#4a7c59",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1,
              padding: "12px",
              border: "none",
              borderRadius: "6px",
              backgroundColor: !isLogin ? "#4a7c59" : "transparent",
              color: !isLogin ? "white" : "#4a7c59",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "12px",
            borderRadius: "6px",
            marginBottom: "20px",
            border: "1px solid #f5c6cb"
          }}>
            {error}
          </div>
        )}

        {/* Forms */}
        {isLogin ? (
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2d5a27" }}>
                Username or Email
              </label>
              <input
                type="text"
                name="username"
                value={loginForm.username}
                onChange={handleLoginChange}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e8f5e8",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                  transition: "border-color 0.3s ease",
                  outline: "none"
                }}
                onFocus={(e) => e.target.style.borderColor = "#4a7c59"}
                onBlur={(e) => e.target.style.borderColor = "#e8f5e8"}
                placeholder="Enter username or email"
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2d5a27" }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={loginForm.password}
                onChange={handleLoginChange}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e8f5e8",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                  transition: "border-color 0.3s ease",
                  outline: "none"
                }}
                onFocus={(e) => e.target.style.borderColor = "#4a7c59"}
                onBlur={(e) => e.target.style.borderColor = "#e8f5e8"}
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "15px",
                backgroundColor: loading ? "#6c757d" : "#4a7c59",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 2px 4px rgba(74, 124, 89, 0.3)",
                transition: "all 0.3s ease",
                marginBottom: "20px"
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2d5a27" }}>
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={registerForm.firstName}
                  onChange={handleRegisterChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e8f5e8",
                    borderRadius: "8px",
                    fontSize: "16px",
                    boxSizing: "border-box",
                    transition: "border-color 0.3s ease",
                    outline: "none"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#4a7c59"}
                  onBlur={(e) => e.target.style.borderColor = "#e8f5e8"}
                  placeholder="First name"
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2d5a27" }}>
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={registerForm.lastName}
                  onChange={handleRegisterChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e8f5e8",
                    borderRadius: "8px",
                    fontSize: "16px",
                    boxSizing: "border-box",
                    transition: "border-color 0.3s ease",
                    outline: "none"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#4a7c59"}
                  onBlur={(e) => e.target.style.borderColor = "#e8f5e8"}
                  placeholder="Last name"
                />
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2d5a27" }}>
                Username
              </label>
              <input
                type="text"
                name="username"
                value={registerForm.username}
                onChange={handleRegisterChange}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e8f5e8",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                  transition: "border-color 0.3s ease",
                  outline: "none"
                }}
                onFocus={(e) => e.target.style.borderColor = "#4a7c59"}
                onBlur={(e) => e.target.style.borderColor = "#e8f5e8"}
                placeholder="Choose a username"
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2d5a27" }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={registerForm.email}
                onChange={handleRegisterChange}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e8f5e8",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                  transition: "border-color 0.3s ease",
                  outline: "none"
                }}
                onFocus={(e) => e.target.style.borderColor = "#4a7c59"}
                onBlur={(e) => e.target.style.borderColor = "#e8f5e8"}
                placeholder="Enter your email"
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2d5a27" }}>
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={registerForm.phone}
                onChange={handleRegisterChange}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e8f5e8",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                  transition: "border-color 0.3s ease",
                  outline: "none"
                }}
                onFocus={(e) => e.target.style.borderColor = "#4a7c59"}
                onBlur={(e) => e.target.style.borderColor = "#e8f5e8"}
                placeholder="Enter phone number"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2d5a27" }}>
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e8f5e8",
                    borderRadius: "8px",
                    fontSize: "16px",
                    boxSizing: "border-box",
                    transition: "border-color 0.3s ease",
                    outline: "none"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#4a7c59"}
                  onBlur={(e) => e.target.style.borderColor = "#e8f5e8"}
                  placeholder="Password"
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2d5a27" }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={registerForm.confirmPassword}
                  onChange={handleRegisterChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e8f5e8",
                    borderRadius: "8px",
                    fontSize: "16px",
                    boxSizing: "border-box",
                    transition: "border-color 0.3s ease",
                    outline: "none"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#4a7c59"}
                  onBlur={(e) => e.target.style.borderColor = "#e8f5e8"}
                  placeholder="Confirm password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "15px",
                backgroundColor: loading ? "#6c757d" : "#4a7c59",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 2px 4px rgba(74, 124, 89, 0.3)",
                transition: "all 0.3s ease",
                marginBottom: "20px"
              }}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
        )}

        {/* Admin Login Button */}
        <div style={{ textAlign: "center", marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #e8f5e8" }}>
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            style={{
              padding: "10px 20px",
              backgroundColor: isAdmin ? "#dc3545" : "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          >
            {isAdmin ? "👤 User Login" : "⚙️ Login as Admin"}
          </button>
          {isAdmin && (
            <p style={{ margin: "10px 0 0 0", fontSize: "12px", color: "#666" }}>
              Admin credentials: username: admin, password: 1234
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
