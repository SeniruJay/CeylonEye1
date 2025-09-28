import React from "react";
import { Link } from "react-router-dom";

const Services = () => {
  const cardBaseStyle = {
    background: "#ffffff", // solid white
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
    border: "1px solid #eaeaea",
    textAlign: "center",
    transition: "transform 0.4s ease, box-shadow 0.4s ease",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    animation: "fadeSlideUp 1s ease forwards",
    opacity: 0,
  };

  const services = [
    {
      icon: "🏨",
      title: "Accommodation",
      text: "Choose from luxury resorts, boutique hotels, villas, and cozy homestays across the island.",
      link: "/services/accommodation",
      btn: "Browse Accommodation",
    },
    {
      icon: "🚗",
      title: "Transport Services",
      text: "Book private cars, luxury vans, or buses with professional local drivers for safe travel.",
      link: "/transport",
      btn: "Book Transport",
    },
    {
      icon: "🗺️",
      title: "Locations",
      text: "From golden beaches to misty hill country, explore curated destinations tailored for you.",
      link: "/services/locations",
      btn: "Explore Locations",
    },
    {
      icon: "🎯",
      title: "Leisure Activities",
      text: "Safaris, whale watching, surfing, diving, hiking, and heritage tours for unforgettable memories.",
      link: "/services/activities",
      btn: "Find Activities",
    },
    {
      icon: "🍴",
      title: "Food & Dining",
      text: "Taste authentic Sri Lankan cuisine, fine dining, and street food guided by locals.",
      link: "/services/dining",
      btn: "Explore Dining",
    },
    {
      icon: "🛍️",
      title: "Shopping & Crafts",
      text: "Discover gems, handlooms, tea, spices, and souvenirs in local markets and stores.",
      link: "/services/shopping",
      btn: "Shop Local",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "60px",
        backgroundImage:
          "url('https://plus.unsplash.com/premium_photo-1681223447322-46794b8cdfd5?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3JpJTIwbGFua2ElMjBiZWFjaHxlbnwwfHwwfHx8MA%3D%3D')",
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
          backgroundColor: "rgba(0,0,0,0.45)",
          zIndex: 0,
        }}
      />

      {/* Animations CSS */}
      <style>{`
        @keyframes fadeSlideUp {
          0% {
            transform: translateY(40px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>

      {/* Main Content */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header Banner */}
        <div
          style={{
            borderRadius: "18px",
            padding: "60px 30px",
            marginBottom: "30px",
            color: "white",
            background:
              "linear-gradient(135deg, rgba(0,0,0,0.55), rgba(0,0,0,0.65)), url('https://images.unsplash.com/photo-1507296993015-167a20c29988?auto=format&fit=crop&w=1400&q=80') center/cover no-repeat",
            boxShadow: "0 12px 32px rgba(0,0,0,0.3)",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "2.6rem", fontWeight: 800 }}>
            Explore Sri Lanka with CeylonEye
          </h1>
          <p style={{ marginTop: "12px", fontSize: "1.2rem", opacity: 0.95 }}>
            Handpicked services to craft your perfect journey
          </p>
        </div>

        {/* Service Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "24px",
            marginBottom: "50px",
          }}
        >
          {services.map((s, i) => (
            <div
              key={i}
              style={{
                ...cardBaseStyle,
                animationDelay: `${i * 0.2}s`, // stagger effect
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 14px 32px rgba(0,0,0,0.3)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
              }}
            >
              <div>
                <div style={{ fontSize: "3rem", marginBottom: 12 }}>{s.icon}</div>
                <h3 style={{ color: "#2d5a27", margin: 0, marginBottom: 8 }}>
                  {s.title}
                </h3>
                <p
                  style={{
                    color: "#555",
                    marginTop: 0,
                    marginBottom: 18,
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                  }}
                >
                  {s.text}
                </p>
              </div>
              <Link
                to={s.link}
                style={{
                  display: "inline-block",
                  marginTop: "auto",
                  padding: "12px 20px",
                  borderRadius: 8,
                  background: "#2d6a4f",
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 600,
                  transition: "0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#40916c")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#2d6a4f")}
              >
                {s.btn}
              </Link>
            </div>
          ))}
        </div>

        
      
      </div>
    </div>
  );
};

export default Services;
