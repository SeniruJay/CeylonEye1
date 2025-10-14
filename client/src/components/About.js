import React from "react";

const About = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "80px 20px 60px 20px",
        backgroundImage: "url('https://images.unsplash.com/photo-1734279135115-6d8984e08206?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074')",
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
            letterSpacing: "2px",
            marginBottom: "20px",
            textShadow: "2px 2px 4px rgba(0,0,0,0.7)"
          }}>
            About Us
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
            Your trusted companion for authentic Sri Lankan adventures
          </p>
        </div>

        {/* Story Section */}
        <div
          className="fade-section fade-delay-2"
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            padding: "40px",
            marginBottom: "50px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            color: "white",
            lineHeight: 1.8,
            backdropFilter: "blur(15px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
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
                background: "rgba(255, 255, 255, 0.1)",
                color: "white",
                borderRadius: "16px",
                padding: "24px",
                textAlign: "center",
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                transition: "0.3s",
                backdropFilter: "blur(15px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
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
              <h3 style={{ marginBottom: 10, color: "white", textShadow: "1px 1px 2px rgba(0,0,0,0.7)" }}>
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
