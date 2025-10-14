import React from "react";

const FAQs = () => {
  const faqs = [
    {
      q: "How do I book transport?",
      a: "Go to Services → Transport, filter your needs, then proceed to booking.",
    },
    {
      q: "Can I choose vehicle type?",
      a: "Yes. Filter by vehicle type or seats, then select an available provider.",
    },
    {
      q: "Do you offer airport transfers?",
      a: "Yes, many providers support airport pickup and drop-off. Add it in notes.",
    },
    {
      q: "How do I cancel a booking?",
      a: "Contact support via the Contact page. Include your booking ID.",
    },
  ];

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
            from { opacity: 0; transform: translateY(25px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .fade-section {
            animation: fadeInUp 0.9s ease forwards;
            opacity: 0;
          }
          .faq-card {
            transition: 0.3s;
            cursor: pointer;
          }
          .faq-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.18);
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
              "linear-gradient(135deg, rgba(0,0,0,0.65), rgba(0,0,0,0.75)), url('https://www.planetware.com/wpimages/2020/01/sri-lanka-top-attractions-sigiriya.jpg') center/cover no-repeat",
            boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "2.6rem", fontWeight: 800 }}>
            Frequently Asked Questions
          </h1>
          <p style={{ marginTop: 10, fontSize: "1.2rem", opacity: 0.95 }}>
            Quick answers to common questions about CeylonEye
          </p>
        </div>

        {/* FAQ Section */}
        <div
          className="fade-section"
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: 16,
            padding: "20px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            animationDelay: "0.3s",
          }}
        >
          {faqs.map((f, i) => (
            <div
              key={i}
              className="faq-card"
              style={{
                padding: 20,
                borderBottom:
                  i < faqs.length - 1 ? "1px solid #e0f0e0" : "none",
              }}
            >
              <div
                style={{
                  color: "#2d6a4f",
                  fontWeight: 700,
                  marginBottom: 6,
                  fontSize: "1.1rem",
                }}
              >
                ❓ {f.q}
              </div>
              <div style={{ color: "#444", lineHeight: 1.7, fontSize: "0.95rem" }}>
                {f.a}
              </div>
            </div>
          ))}
        </div>

        
      </div>
    </div>
  );
};

export default FAQs;
