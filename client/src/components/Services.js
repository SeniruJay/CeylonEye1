import React from "react";
import { Link } from "react-router-dom";

const Services = () => {
  const cardBaseStyle = {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    border: "1px solid #e8f5e8",
    textAlign: "center",
    transition: "transform 0.3s ease, box-shadow 0.3s ease"
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{
        borderRadius: "18px",
        padding: "60px 30px",
        marginBottom: "30px",
        color: "white",
        background: "linear-gradient(135deg, rgba(0,0,0,0.45), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1558981420-b3c5ae0b37f6?q=80&w=1400&auto=format&fit=crop') center/cover no-repeat",
        boxShadow: "0 12px 32px rgba(0,0,0,0.2)"
      }}>
        <h1 style={{ margin: 0, fontSize: "2.4rem", fontWeight: 700 }}>Explore Sri Lanka with CeylonEye</h1>
        <p style={{ marginTop: "10px", fontSize: "1.1rem", opacity: 0.95 }}>Handpicked services to craft your perfect journey</p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "24px"
      }}>
        <div
          style={cardBaseStyle}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-6px)";
            e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.12)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: 12 }}>🏨</div>
          <h3 style={{ color: "#2d5a27", margin: 0, marginBottom: 8 }}>Accommodation</h3>
          <p style={{ color: "#555", marginTop: 0, marginBottom: 18 }}>Hotels, villas, and homestays across the island.</p>
          <Link to="/services/accommodation" style={{ display: "inline-block", padding: "10px 18px", borderRadius: 8, background: "#4a7c59", color: "#fff", textDecoration: "none", fontWeight: 600 }}>Browse Accommodation</Link>
        </div>

        <div
          style={cardBaseStyle}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-6px)";
            e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.12)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: 12 }}>🚗</div>
          <h3 style={{ color: "#2d5a27", margin: 0, marginBottom: 8 }}>Transport Services</h3>
          <p style={{ color: "#555", marginTop: 0, marginBottom: 18 }}>Private cars, vans, buses, and more.</p>
          <Link to="/transport" style={{ display: "inline-block", padding: "10px 18px", borderRadius: 8, background: "#4a7c59", color: "#fff", textDecoration: "none", fontWeight: 600 }}>Book Transport</Link>
        </div>

        <div
          style={cardBaseStyle}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-6px)";
            e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.12)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: 12 }}>🗺️</div>
          <h3 style={{ color: "#2d5a27", margin: 0, marginBottom: 8 }}>Locations</h3>
          <p style={{ color: "#555", marginTop: 0, marginBottom: 18 }}>From beaches to hill country, plan your route.</p>
          <Link to="/services/locations" style={{ display: "inline-block", padding: "10px 18px", borderRadius: 8, background: "#4a7c59", color: "#fff", textDecoration: "none", fontWeight: 600 }}>Explore Locations</Link>
        </div>

        <div
          style={cardBaseStyle}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-6px)";
            e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.12)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: 12 }}>🎯</div>
          <h3 style={{ color: "#2d5a27", margin: 0, marginBottom: 8 }}>Leisure Activities</h3>
          <p style={{ color: "#555", marginTop: 0, marginBottom: 18 }}>Safaris, surfing, heritage walks, and more.</p>
          <Link to="/services/activities" style={{ display: "inline-block", padding: "10px 18px", borderRadius: 8, background: "#4a7c59", color: "#fff", textDecoration: "none", fontWeight: 600 }}>Find Activities</Link>
        </div>
      </div>
    </div>
  );
};

export default Services;


