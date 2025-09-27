import React from "react";
import { Link } from "react-router-dom";

const Homepage = () => {

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Hero Slider */}
      <div style={{ borderRadius: "18px", overflow: "hidden", marginBottom: "30px", boxShadow: "0 12px 32px rgba(0,0,0,0.2)" }}>
        <style>{`
          @keyframes ceSlider {
            0% { transform: translateX(0%); }
            28% { transform: translateX(0%); }
            33% { transform: translateX(-100%); }
            61% { transform: translateX(-100%); }
            66% { transform: translateX(-200%); }
            95% { transform: translateX(-200%); }
            100% { transform: translateX(0%); }
          }
        `}</style>
        <div style={{ position: "relative", width: "100%", height: 360 }}>
          <div style={{ width: "300%", height: "100%", display: "flex", animation: "ceSlider 24s infinite" }}>
            {[
              "https://images.unsplash.com/photo-1561893670-23b63a781f1c?q=80&w=1400&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=1400&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1400&auto=format&fit=crop"
            ].map((src, idx) => (
              <div key={idx} style={{ width: "100%" }}>
                <div style={{ width: "100%", height: "100%", background: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url('${src}') center/cover no-repeat` }} />
              </div>
            ))}
          </div>
          <div style={{ position: "absolute", bottom: 20, left: 20, color: "#fff" }}>
            <h1 style={{ margin: 0, fontSize: "2.2rem", fontWeight: 800 }}>Experience Sri Lanka</h1>
            <p style={{ marginTop: 6, marginBottom: 0, fontSize: "1.05rem" }}>Beaches, heritage, wildlife, and hill country adventures</p>
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
        {[{icon:"🏖️", title:"Pristine Beaches", text:"Unwind at the golden coasts"}, {icon:"🕌", title:"Rich Heritage", text:"Explore ancient cities"}, {icon:"🐘", title:"Wildlife Safaris", text:"Yala, Minneriya, Wilpattu"}, {icon:"⛰️", title:"Hill Country", text:"Tea trails and scenic trains"}].map((h, i) => (
          <div key={i} style={{ background: "white", borderRadius: 12, padding: 16, border: "1px solid #e8f5e8", boxShadow: "0 6px 16px rgba(0,0,0,0.06)", textAlign: "center" }}>
            <div style={{ fontSize: "2rem" }}>{h.icon}</div>
            <div style={{ color: "#2d5a27", fontWeight: 700, marginTop: 8 }}>{h.title}</div>
            <div style={{ color: "#555", marginTop: 6 }}>{h.text}</div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div style={{ background: "white", border: "1px solid #e8f5e8", borderRadius: 16, padding: 20, boxShadow: "0 8px 24px rgba(0,0,0,0.06)", marginBottom: 24 }}>
        <div style={{ color: "#2d5a27", fontWeight: 700, marginBottom: 12, fontSize: 18 }}>Plan Your Trip</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <Link to="/services" style={{ padding: "10px 16px", background: "#4a7c59", color: "#fff", borderRadius: 8, textDecoration: "none", fontWeight: 700 }}>Explore Services</Link>
          <Link to="/transport" style={{ padding: "10px 16px", background: "#2d5a27", color: "#fff", borderRadius: 8, textDecoration: "none", fontWeight: 700 }}>Book Transport</Link>
          <Link to="/about" style={{ padding: "10px 16px", background: "#6c757d", color: "#fff", borderRadius: 8, textDecoration: "none", fontWeight: 700 }}>About Us</Link>
          <Link to="/contact" style={{ padding: "10px 16px", background: "#6c757d", color: "#fff", borderRadius: 8, textDecoration: "none", fontWeight: 700 }}>Contact</Link>
        </div>
      </div>

      {/* Admin Panel Link (Admin Only) */}
      {false && (
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

      {/* Profile modal removed; now handled in header */}
    </div>
  );
};

export default Homepage;
