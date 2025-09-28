import React from "react";

const About = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1566299597203-225f611b865f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDU5fHx8ZW58MHx8fHx8')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        position: "relative",
        color: "white",
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
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes zoomIn {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          .fade-section {
            animation: fadeInUp 1s ease forwards;
            opacity: 0;
          }

          .fade-delay-1 { animation-delay: 0.2s; }
          .fade-delay-2 { animation-delay: 0.4s; }
          .fade-delay-3 { animation-delay: 0.6s; }
          .fade-delay-4 { animation-delay: 0.8s; }

          .zoom-image {
            animation: zoomIn 1.2s ease forwards;
            opacity: 0;
          }
        `}
      </style>

      {/* Main Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "40px 20px",
        }}
      >
        {/* Banner Section */}
        <div
          className="fade-section fade-delay-1"
          style={{
            borderRadius: "18px",
            padding: "60px 30px",
            marginBottom: "30px",
            textAlign: "center",
            background:
              "linear-gradient(135deg, rgba(0,0,0,0.65), rgba(0,0,0,0.75)), url('https://media.istockphoto.com/id/1346277278/photo/lighthouse-in-galle-fort.jpg?s=612x612&w=0&k=20&c=-wYOG_WqCtCKqvI-8qAZf14BisAErHFQEar9g9epvgQ=') center/cover no-repeat",
            boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "2.8rem", fontWeight: 800 }}>
            About CeylonEye
          </h1>
          <p style={{ marginTop: 12, fontSize: "1.2rem", opacity: 0.95 }}>
            Your companion for authentic Sri Lankan travel
          </p>
        </div>

        {/* Story Section */}
        <div
          className="fade-section fade-delay-2"
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "30px",
            marginBottom: "40px",
            boxShadow: "0 6px 24px rgba(0,0,0,0.15)",
            color: "#333",
            lineHeight: 1.8,
          }}
        >
          <p>
            At <strong>CeylonEye</strong>, we connect travelers with trusted
            local providers to make journeys across Sri Lanka effortless and
            memorable. From curated transport to inspiring experiences, we focus
            on <strong>reliability, safety</strong>, and genuine{" "}
            <strong>Sri Lankan hospitality</strong>.
          </p>
          <p>
            Our mission is to promote <strong>sustainable tourism</strong> while
            empowering local communities and showcasing the island’s rich{" "}
            <strong>culture, wildlife, and landscapes</strong>.
          </p>
        </div>

        {/* Mission, Vision, Values Section */}
        <div
          className="fade-section fade-delay-3"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
            marginBottom: "50px",
          }}
        >
          {[
            {
              icon: "🎯",
              title: "Our Mission",
              text: "Deliver unforgettable, safe, and sustainable travel experiences while supporting local communities.",
            },
            {
              icon: "🌍",
              title: "Our Vision",
              text: "To be the leading platform for Sri Lankan tourism, known for authenticity, trust, and impact.",
            },
            {
              icon: "🤝",
              title: "Our Values",
              text: "Authenticity, Responsibility, Innovation, and Respect for culture, nature, and people.",
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                background: "#ffffff",
                color: "#333",
                borderRadius: "16px",
                padding: "24px",
                textAlign: "center",
                boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                transition: "0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-6px) scale(1.03)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0) scale(1)")
              }
            >
              <div style={{ fontSize: "2.5rem", marginBottom: 10 }}>
                {item.icon}
              </div>
              <h3 style={{ marginBottom: 10, color: "#2d6a4f" }}>
                {item.title}
              </h3>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.6 }}>{item.text}</p>
            </div>
          ))}
        </div>

        {/* Image + Text Layout */}
        <div
          className="fade-section fade-delay-4"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "30px",
            alignItems: "center",
            marginBottom: "60px",
          }}
        >
          <img
            className="zoom-image"
            src="https://doa.gov.lk/wp-content/uploads/2023/05/pH_Interpolated.png"
            alt="Sri Lanka journey"
            style={{
              width: "100%",
              borderRadius: "16px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
            }}
          />
          <div
            style={{
              background: "rgba(255,255,255,0.95)",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
              color: "#333",
              lineHeight: 1.8,
            }}
          >
            <h2 style={{ color: "#2d6a4f", marginBottom: 12 }}>
              Why Choose Us?
            </h2>
            <p>
              With <strong>CeylonEye</strong>, every trip is personalized and
              crafted with care. We ensure that travelers don’t just visit Sri
              Lanka — they experience it, with deeper cultural connections,
              breathtaking adventures, and responsible travel choices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
