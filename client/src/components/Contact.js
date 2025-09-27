import React, { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{
        borderRadius: "18px",
        padding: "50px 30px",
        marginBottom: "24px",
        color: "white",
        background: "linear-gradient(135deg, rgba(0,0,0,0.45), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1589307004173-3c95204b5b19?q=80&w=1400&auto=format&fit=crop') center/cover no-repeat",
        boxShadow: "0 12px 32px rgba(0,0,0,0.2)"
      }}>
        <h1 style={{ margin: 0, fontSize: "2.2rem", fontWeight: 700 }}>Contact Us</h1>
        <p style={{ marginTop: 10, opacity: 0.95 }}>We'd love to hear from you</p>
      </div>

      <div style={{ background: "white", border: "1px solid #e8f5e8", borderRadius: 16, padding: 24, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
        {sent ? (
          <div style={{ color: "#2d5a27", fontWeight: 600 }}>Thanks! We'll get back to you shortly.</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ display: "block", marginBottom: 6, color: "#2d5a27", fontWeight: 600 }}>Name</label>
                <input name="name" value={form.name} onChange={handleChange} required style={{ width: "100%", padding: 12, borderRadius: 8, border: "2px solid #e8f5e8" }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 6, color: "#2d5a27", fontWeight: 600 }}>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required style={{ width: "100%", padding: 12, borderRadius: 8, border: "2px solid #e8f5e8" }} />
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <label style={{ display: "block", marginBottom: 6, color: "#2d5a27", fontWeight: 600 }}>Message</label>
              <textarea name="message" value={form.message} onChange={handleChange} rows="5" required style={{ width: "100%", padding: 12, borderRadius: 8, border: "2px solid #e8f5e8" }} />
            </div>
            <div style={{ marginTop: 16 }}>
              <button type="submit" style={{ padding: "12px 20px", background: "#4a7c59", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700 }}>Send Message</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact;


