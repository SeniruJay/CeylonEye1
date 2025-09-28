import React, { useState } from "react";
import axios from "axios";

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  const inputStyle = {
    width: "100%",
    padding: "14px",
    border: "2px solid #e8f5e8",
    borderRadius: "8px",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
    transition: "0.3s",
  };

  const handleLoginChange = (e) =>
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });

  const handleRegisterChange = (e) =>
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        ...loginForm,
        role: isAdmin ? "admin" : "user",
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
        role: isAdmin ? "admin" : "user",
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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        backgroundImage: `url("https://images.unsplash.com/photo-1653959699604-1eb000740b57?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNyaSUyMGxhbmthJTIwYmVhY2h8ZW58MHx8MHx8fDA%3D")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom right, rgba(0,0,0,0.65), rgba(0,0,0,0.3))",
          zIndex: 0,
        }}
      />

      {/* Card */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.92)",
          borderRadius: "18px",
          boxShadow: "0 12px 35px rgba(0,0,0,0.25)",
          padding: "40px",
          width: "100%",
          maxWidth: "460px",
          zIndex: 1,
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.3)",
        }}
      >
        {/* Logo + Title */}
        <div style={{ textAlign: "center", marginBottom: "25px" }}>
          <div style={{ width: "80px", height: "80px", margin: "0 auto 15px" }}>
            {/* SVG Logo */}
            <svg width="80" height="80" viewBox="0 0 100 100">
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
          <h1 style={{ margin: "0", fontSize: "2.2rem", fontWeight: "bold", color: "#2d5a27" }}>
            CEYLONEYE
          </h1>
          <p style={{ color: "#4a7c59", margin: "5px 0 0" }}>Tourism Management System</p>
        </div>

        {/* Toggle */}
        <div
          style={{
            display: "flex",
            marginBottom: "25px",
            backgroundColor: "#edf7ef",
            borderRadius: "10px",
            padding: "4px",
          }}
        >
          <button
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: "12px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: isLogin ? "#4a7c59" : "transparent",
              color: isLogin ? "white" : "#4a7c59",
              fontWeight: "600",
              cursor: "pointer",
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
              borderRadius: "8px",
              backgroundColor: !isLogin ? "#4a7c59" : "transparent",
              color: !isLogin ? "white" : "#4a7c59",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              backgroundColor: "#f8d7da",
              color: "#721c24",
              padding: "12px",
              borderRadius: "6px",
              marginBottom: "20px",
              border: "1px solid #f5c6cb",
            }}
          >
            {error}
          </div>
        )}

        {/* Forms */}
        {isLogin ? (
          <form onSubmit={handleLogin}>
            <input
              type="text"
              name="username"
              value={loginForm.username}
              onChange={handleLoginChange}
              placeholder="Enter username or email"
              required
              style={inputStyle}
            />
            <div style={{ height: "15px" }} />
            <input
              type="password"
              name="password"
              value={loginForm.password}
              onChange={handleLoginChange}
              placeholder="Enter password"
              required
              style={inputStyle}
            />
            <div style={{ height: "20px" }} />
            <button
              type="submit"
              disabled={loading}
              style={{
                ...inputStyle,
                backgroundColor: loading ? "#6c757d" : "#4a7c59",
                color: "white",
                border: "none",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <input
                type="text"
                name="firstName"
                value={registerForm.firstName}
                onChange={handleRegisterChange}
                placeholder="First Name"
                required
                style={inputStyle}
              />
              <input
                type="text"
                name="lastName"
                value={registerForm.lastName}
                onChange={handleRegisterChange}
                placeholder="Last Name"
                required
                style={inputStyle}
              />
            </div>
            <div style={{ height: "15px" }} />
            <input
              type="text"
              name="username"
              value={registerForm.username}
              onChange={handleRegisterChange}
              placeholder="Choose a username"
              required
              style={inputStyle}
            />
            <div style={{ height: "15px" }} />
            <input
              type="email"
              name="email"
              value={registerForm.email}
              onChange={handleRegisterChange}
              placeholder="Enter your email"
              required
              style={inputStyle}
            />
            <div style={{ height: "15px" }} />
            <input
              type="tel"
              name="phone"
              value={registerForm.phone}
              onChange={handleRegisterChange}
              placeholder="Enter phone number"
              required
              style={inputStyle}
            />
            <div style={{ height: "15px" }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <input
                type="password"
                name="password"
                value={registerForm.password}
                onChange={handleRegisterChange}
                placeholder="Password"
                required
                style={inputStyle}
              />
              <input
                type="password"
                name="confirmPassword"
                value={registerForm.confirmPassword}
                onChange={handleRegisterChange}
                placeholder="Confirm Password"
                required
                style={inputStyle}
              />
            </div>
            <div style={{ height: "20px" }} />
            <button
              type="submit"
              disabled={loading}
              style={{
                ...inputStyle,
                backgroundColor: loading ? "#6c757d" : "#4a7c59",
                color: "white",
                border: "none",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
        )}

        {/* Admin Switch */}
        <div style={{ textAlign: "center", marginTop: "20px", borderTop: "1px solid #e8f5e8", paddingTop: "15px" }}>
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            style={{
              padding: "10px 20px",
              backgroundColor: isAdmin ? "#dc3545" : "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "20px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {isAdmin ? "👤 User Login" : "⚙️ Login as Admin"}
          </button>
          {isAdmin && (
            <p style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}>
              Admin credentials: username: admin, password: 1234
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
