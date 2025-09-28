import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Homepage = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("fade-in-up");
        });
      },
      { threshold: 0.2 }
    );
    document.querySelectorAll(".scroll-animate").forEach((el) => {
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1646894232861-a0ad84f1ad5d?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Semi-transparent overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.45)",
          zIndex: 0,
        }}
      />

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up { animation: fadeUp 1s ease forwards; }

        /* Gradient text animation */
        @keyframes gradientText {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-gradient {
          background: linear-gradient(270deg, #ff6ec4, #7873f5, #42e695, #f7971e, #ff6ec4);
          background-size: 1000% 1000%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientText 8s ease infinite;
        }
      `}</style>

      {/* Page content */}
      <div style={{ position: "relative", zIndex: 1, padding: "20px" }}>
        {/* ✅ Hero Banner */}
        <div
          className="scroll-animate"
          style={{
            borderRadius: "18px",
            overflow: "hidden",
            marginBottom: "50px",
            boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
            position: "relative",
            height: 450,
            background: `linear-gradient(rgba(104, 104, 98, 0.3), rgba(0, 0, 0, 0.54)), 
                        url('https://images.unsplash.com/photo-1549893079-842e6d278e2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80') 
                        center/cover no-repeat`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 50px",
          }}
        >
          {/* Left Side Text */}
          <div style={{ maxWidth: "600px", color: "white" }}>
            <h1
              className="animated-gradient"
              style={{
                margin: 0,
                fontSize: "3.8rem",
                fontWeight: 900,
                lineHeight: 1.2,
                textShadow: "2px 4px 12px rgba(0,0,0,0.5)",
              }}
            >
              Discover Sri Lanka with CEYLONEYE
            </h1>
            <p style={{ marginTop: 12, fontSize: "1.3rem", color: "#f8f9fa" }}>
              Paradise island of golden beaches, rich heritage & lush adventures.
            </p>
            <Link
              to="/services"
              style={{
                display: "inline-block",
                marginTop: "18px",
                padding: "14px 28px",
                background: "#2d6a4f",
                color: "white",
                fontWeight: "700",
                fontSize: "1.1rem",
                borderRadius: "12px",
                textDecoration: "none",
                boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
                transition: "all 0.3s ease",
              }}
            >
              🌴 Start Your Journey
            </Link>
          </div>

          {/* Right Side Image */}
          <div
            style={{
              flex: "0 0 40%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              src="https://yeadimtours.com/wp-content/uploads/2020/01/%D7%A7%D7%95%D7%9C%D7%90%D7%96-%D7%A1%D7%A8%D7%99-%D7%9C%D7%A0%D7%A7%D7%94-1.jpg"
              alt="Sri Lanka Collage"
              style={{
                width: "100%",
                maxWidth: "420px",
                height: "auto",
                borderRadius: "14px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
              }}
            />
          </div>
        </div>

        {/* Highlights */}
        <div
          className="scroll-animate"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20,
            marginBottom: 50,
          }}
        >
          {[
            { icon: "🏖️", title: "Beaches", text: "Relax at Mirissa, Bentota & Unawatuna" },
            { icon: "🏯", title: "Culture", text: "Sigiriya, Anuradhapura & Kandy" },
            { icon: "🐆", title: "Wildlife", text: "Yala & Minneriya safaris" },
            { icon: "🚂", title: "Scenic Rides", text: "World-famous train to Ella" },
          ].map((h, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                borderRadius: 16,
                padding: 24,
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
                textAlign: "center",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.25)";
              }}
            >
              <div style={{ fontSize: "2.6rem" }}>{h.icon}</div>
              <div
                style={{
                  color: "#fff",
                  fontWeight: 800,
                  marginTop: 10,
                  fontSize: "1.3rem",
                  textShadow: "1px 1px 4px rgba(0,0,0,0.6)",
                }}
              >
                {h.title}
              </div>
              <div
                style={{
                  color: "#eee",
                  marginTop: 6,
                  fontSize: "1rem",
                  textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
                }}
              >
                {h.text}
              </div>
            </div>
          ))}
        </div>

        {/* Top Destinations */}
        <div className="scroll-animate" style={{ marginBottom: 50 }}>
          <h2 style={{ color: "white", fontWeight: 800, marginBottom: 20 }}>
            🌏 Top Destinations
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {[
              {
                img: "https://images.unsplash.com/photo-1642095012245-bda8033e8ee3?fm=jpg&q=60&w=3000",
                name: "Kandy",
              },
              {
                img: "https://media.istockphoto.com/id/684887518/photo/deer-at-hortons-plain-national-park-sri-lanka.jpg?s=612x612&w=0&k=20&c=KetJ0uC9sjNxwNEH_LEdHEV2nNOFUMPMpjvaijF4Rdk=",
                name: "Nuwara Eliya",
              },
              {
                img: "https://images.unsplash.com/photo-1591351373936-3d5bf044b854?fm=jpg&q=60&w=3000",
                name: "Mirissa",
              },
              {
                img: "https://images.unsplash.com/photo-1546656495-fc838de15e5c?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0",
                name: "Colombo",
              },
            ].map((d, i) => (
              <div
                key={i}
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
                  position: "relative",
                  transition: "transform 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <img
                  src={d.img}
                  alt={d.name}
                  style={{ width: "100%", height: 180, objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "10px",
                    background: "rgba(0,0,0,0.55)",
                    color: "white",
                    fontWeight: 700,
                    textAlign: "center",
                  }}
                >
                  {d.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div
          className="scroll-animate"
          style={{
            background: "rgba(255,255,255,0.9)",
            borderRadius: 16,
            padding: 30,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            marginBottom: 50,
          }}
        >
          <h2 style={{ color: "#2d5a27", fontWeight: 800, marginBottom: 20 }}>
            🌟 Why Choose CeylonEye?
          </h2>
          <ul style={{ color: "#333", lineHeight: "1.8" }}>
            <li>✔️ Personalized tours & transport</li>
            <li>✔️ Local expert guides</li>
            <li>✔️ 24/7 customer support</li>
            <li>✔️ Best price guarantee</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
