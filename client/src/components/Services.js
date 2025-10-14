import React from "react";
import { Link } from "react-router-dom";

const Services = () => {
  const cardBaseStyle = {
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "20px",
    padding: "35px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    textAlign: "center",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    animation: "fadeSlideUp 1s ease forwards",
    opacity: 0,
    backdropFilter: "blur(15px)",
  };

  const services = [
    {
      icon: "https://images.unsplash.com/photo-1669664863985-ac4a81e7483e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
      title: "Accommodation",
      text: "Choose from luxury resorts, boutique hotels, villas, and cozy homestays across the island.",
      link: "/services/accommodation",
      btn: "Browse Accommodation",
    },
    {
      icon: "https://images.unsplash.com/photo-1634787583218-a7cee5720859?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fHNhZmFyaSUyMGplZXAlMjBzcmklMjBsYW5rYXxlbnwwfDB8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600",
      title: "Transport Services",
      text: "Book private cars, luxury vans, or buses with professional local drivers for safe travel.",
      link: "/transport",
      btn: "Book Transport",
    },
    {
      icon: "https://images.unsplash.com/photo-1612862862126-865765df2ded?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074",
      title: "Locations",
      text: "From golden beaches to misty hill country, explore curated destinations tailored for you.",
      link: "/services/locations",
      btn: "Explore Locations",
    },
    {
      icon: "https://plus.unsplash.com/premium_photo-1661822856163-1c0472b16174?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
      title: "Leisure Activities",
      text: "Safaris, whale watching, surfing, diving, hiking, and heritage tours for unforgettable memories.",
      link: "/services/activities",
      btn: "Find Activities",
    },
    {
      icon: "https://images.unsplash.com/photo-1619714604882-db1396d4a718?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1078",
      title: "Food & Dining",
      text: "Taste authentic Sri Lankan cuisine, fine dining, and street food guided by locals.",
      link: "/services/dining",
      btn: "Explore Dining",
    },
    {
      icon: "https://images.unsplash.com/photo-1739281468485-dfb4231a004d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2071",
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
        padding: "80px 20px 60px 20px",
        backgroundImage: "url('https://images.unsplash.com/photo-1559372122-1a97b2d22c22?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1331')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        position: "relative",
      }}
    >
      {/* Black gradient overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.7) 100%)",
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
            textAlign: "center",
            padding: "40px 20px",
            marginBottom: "60px",
            color: "white",
          }}
        >
          <h1 style={{ 
            margin: 0, 
            fontSize: "3.5rem", 
            fontWeight: 300,
            color: "white",
            letterSpacing: "2px",
            marginBottom: "20px",
            textShadow: "2px 2px 4px rgba(0,0,0,0.7)"
          }}>
            Our Services
          </h1>
          <p style={{ 
            fontSize: "1.3rem", 
            color: "white",
            fontWeight: 300,
            letterSpacing: "1px",
            maxWidth: "600px",
            margin: "0 auto",
            textShadow: "1px 1px 3px rgba(0,0,0,0.7)"
          }}>
            Discover amazing experiences tailored just for you
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
                e.currentTarget.style.transform = "translateY(-10px)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.15)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
              }}
            >
              <div>
                <div style={{ marginBottom: 12, display: "flex", justifyContent: "center" }}>
                  {s.icon.startsWith('http') ? (
                    <img 
                      src={s.icon} 
                      alt={s.title}
                      style={{
                        width: "100%",
                        height: "120px",
                        objectFit: "cover",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: "3rem" }}>{s.icon}</span>
                  )}
                </div>
                <h3 style={{ color: "white", margin: 0, marginBottom: 8, textShadow: "1px 1px 2px rgba(0,0,0,0.7)" }}>
                  {s.title}
                </h3>
                <p
                  style={{
                    color: "rgba(255, 255, 255, 0.9)",
                    marginTop: 0,
                    marginBottom: 18,
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                    textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
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
