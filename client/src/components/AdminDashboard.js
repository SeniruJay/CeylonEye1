import React from "react";
import { Link } from "react-router-dom";

const Tile = ({ to, emoji, title, color = "#4a7c59" }) => (
  <Link to={to} style={{
    display: "block",
    background: "white",
    border: "1px solid #e8f5e8",
    borderRadius: 16,
    padding: 24,
    textDecoration: "none",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
    transition: "transform .2s ease, box-shadow .2s ease"
  }}
  onMouseOver={(e)=>{ e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 28px rgba(0,0,0,0.1)'; }}
  onMouseOut={(e)=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,0.06)'; }}
  >
    <div style={{ fontSize: 36 }}>{emoji}</div>
    <div style={{ marginTop: 8, color, fontWeight: 800, fontSize: 18 }}>{title}</div>
  </Link>
);

const AdminDashboard = () => {
  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{
        borderRadius: 18,
        padding: "28px 20px",
        marginBottom: 20,
        color: "white",
        background: "linear-gradient(135deg, rgba(0,0,0,0.45), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1504608245011-62bb557b31b0?q=80&w=1200&auto=format&fit=crop') center/cover no-repeat",
        boxShadow: "0 12px 32px rgba(0,0,0,0.2)"
      }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Admin Dashboard</h1>
        <p style={{ margin: 0, opacity: 0.95 }}>Manage all resources</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <Tile to="/admin/users" emoji="👥" title="Manage Users" />
        <Tile to="/admin/transport" emoji="🚗" title="Manage Transport Providers" />
        <Tile to="/admin/accommodations" emoji="🏨" title="Manage Accommodation" />
        <Tile to="/admin/locations" emoji="🗺️" title="Manage Locations" />
        <Tile to="/admin/activities" emoji="🎯" title="Manage Leisure Activities" />
      </div>
    </div>
  );
};

export default AdminDashboard;


