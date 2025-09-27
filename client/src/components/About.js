import React from "react";

const About = () => {
  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{
        borderRadius: "18px",
        padding: "50px 30px",
        marginBottom: "24px",
        color: "white",
        background: "linear-gradient(135deg, rgba(0,0,0,0.45), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1529563021893-cc73b3e47534?q=80&w=1400&auto=format&fit=crop') center/cover no-repeat",
        boxShadow: "0 12px 32px rgba(0,0,0,0.2)"
      }}>
        <h1 style={{ margin: 0, fontSize: "2.2rem", fontWeight: 700 }}>About CeylonEye</h1>
        <p style={{ marginTop: 10, opacity: 0.95 }}>Your companion for authentic Sri Lankan travel</p>
      </div>

      <div style={{ background: "white", border: "1px solid #e8f5e8", borderRadius: 16, padding: 24, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
        <p style={{ color: "#444", lineHeight: 1.8 }}>
          We connect travelers with trusted local providers to make journeys across Sri Lanka effortless and memorable. From curated transport to inspiring experiences, we focus on reliability, safety, and genuine hospitality.
        </p>
        <p style={{ color: "#444", lineHeight: 1.8 }}>
          Our mission is to promote sustainable tourism while empowering local communities and showcasing the island’s rich culture, wildlife, and landscapes.
        </p>
      </div>
    </div>
  );
};

export default About;


