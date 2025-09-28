import React, { useState } from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1581420456035-58b8efadcdea?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHNyaSUyMGxhbmthJTIwYmVhY2h8ZW58MHx8MHx8fDA%3D')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        position: "relative",
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.55)",
          zIndex: 0,
        }}
      />

      {/* Animations */}
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pop {
            0% { transform: scale(0.9); opacity: 0; }
            50% { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(1); }
          }
          .fade-section {
            animation: fadeInUp 1s ease forwards;
            opacity: 0;
          }
          .success-message {
            animation: pop 0.6s ease forwards;
          }
          .social-icons a {
            transition: transform 0.3s ease;
          }
          .social-icons a:hover {
            transform: scale(1.2) rotate(5deg);
          }
        `}
      </style>

      {/* Main Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "40px 20px",
        }}
      >
        {/* Banner */}
        <div
          className="fade-section"
          style={{
            borderRadius: "18px",
            padding: "50px 30px",
            marginBottom: "30px",
            color: "white",
            textAlign: "center",
            background:
              "linear-gradient(135deg, rgba(0,0,0,0.65), rgba(0,0,0,0.75)), url('https://t3.ftcdn.net/jpg/00/66/65/46/360_F_66654653_tqHG15Ru35ScrmKdoCcSpOXYVdXNDL3x.jpg') center/cover no-repeat",
            boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
            animationDelay: "0.2s",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "2.6rem", fontWeight: 800 }}>
            Contact Us
          </h1>
          <p style={{ marginTop: 10, fontSize: "1.2rem", opacity: 0.95 }}>
            We’d love to hear from you. Reach out for any inquiries, bookings,
            or feedback.
          </p>
        </div>

        {/* Contact Info + Form */}
        <div
          className="fade-section"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            background: "rgba(255,255,255,0.95)",
            borderRadius: 16,
            padding: 30,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            animationDelay: "0.5s",
          }}
        >
          {/* Contact Info */}
          <div style={{ color: "#333", lineHeight: 1.8 }}>
            <h2 style={{ color: "#2d6a4f", marginBottom: 12 }}>
              📍 Get in Touch
            </h2>
            <p>
              <strong>Address:</strong> 123 Galle Road, Colombo, Sri Lanka
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:info@ceyloneye.com"
                style={{ color: "#2d6a4f", textDecoration: "none" }}
              >
                info@ceyloneye.com
              </a>
            </p>
            <p>
              <strong>Phone:</strong>{" "}
              <a
                href="tel:+94112223344"
                style={{ color: "#2d6a4f", textDecoration: "none" }}
              >
                +94 11 222 3344
              </a>
            </p>

            {/* Social Media */}
            <div style={{ marginTop: 20 }}>
              <h3 style={{ color: "#2d6a4f", marginBottom: 8 }}>
                🌐 Connect with us
              </h3>
              <div
                className="social-icons"
                style={{ fontSize: "1.8rem", display: "flex", gap: "16px" }}
              >
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#4267B2" }}
                >
                  <FaFacebook />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#E1306C" }}
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#1DA1F2" }}
                >
                  <FaTwitter />
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            {sent ? (
              <div
                className="success-message"
                style={{
                  color: "#2d6a4f",
                  fontWeight: 700,
                  textAlign: "center",
                  fontSize: "1.2rem",
                }}
              >
                ✅ Thanks! We’ll get back to you shortly.
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 6,
                      color: "#2d5a27",
                      fontWeight: 600,
                    }}
                  >
                    Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: 12,
                      borderRadius: 8,
                      border: "2px solid #e8f5e8",
                      outline: "none",
                    }}
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 6,
                      color: "#2d5a27",
                      fontWeight: 600,
                    }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: 12,
                      borderRadius: 8,
                      border: "2px solid #e8f5e8",
                      outline: "none",
                    }}
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 6,
                      color: "#2d5a27",
                      fontWeight: 600,
                    }}
                  >
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows="5"
                    required
                    style={{
                      width: "100%",
                      padding: 12,
                      borderRadius: 8,
                      border: "2px solid #e8f5e8",
                      outline: "none",
                    }}
                  />
                </div>
                <div style={{ textAlign: "center" }}>
                  <button
                    type="submit"
                    style={{
                      padding: "12px 26px",
                      background: "#2d6a4f",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      fontWeight: 700,
                      fontSize: "1rem",
                      cursor: "pointer",
                      transition: "0.3s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#1b4332")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#2d6a4f")
                    }
                  >
                    ✉️ Send Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
