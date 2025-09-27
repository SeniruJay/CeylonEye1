import React from "react";

const FAQs = () => {
  const faqs = [
    { q: "How do I book transport?", a: "Go to Services → Transport, filter your needs, then proceed to booking." },
    { q: "Can I choose vehicle type?", a: "Yes. Filter by vehicle type or seats, then select an available provider." },
    { q: "Do you offer airport transfers?", a: "Yes, many providers support airport pickup and drop-off. Add it in notes." },
    { q: "How do I cancel a booking?", a: "Contact support via the Contact page. Include your booking ID." }
  ];

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{
        borderRadius: "18px",
        padding: "50px 30px",
        marginBottom: "24px",
        color: "white",
        background: "linear-gradient(135deg, rgba(0,0,0,0.45), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1588685028798-6242f1c50f65?q=80&w=1400&auto=format&fit=crop') center/cover no-repeat",
        boxShadow: "0 12px 32px rgba(0,0,0,0.2)"
      }}>
        <h1 style={{ margin: 0, fontSize: "2.2rem", fontWeight: 700 }}>Frequently Asked Questions</h1>
        <p style={{ marginTop: 10, opacity: 0.95 }}>Quick answers to common questions</p>
      </div>

      <div style={{ background: "white", border: "1px solid #e8f5e8", borderRadius: 16, padding: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
        {faqs.map((f, i) => (
          <div key={i} style={{ padding: 16, borderBottom: i < faqs.length - 1 ? "1px solid #eef6ee" : "none" }}>
            <div style={{ color: "#2d5a27", fontWeight: 700, marginBottom: 6 }}>{f.q}</div>
            <div style={{ color: "#444", lineHeight: 1.7 }}>{f.a}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQs;


