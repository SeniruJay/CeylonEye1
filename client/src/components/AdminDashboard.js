import React from "react";
import { Link } from "react-router-dom";
import AdminNavbar from "./admin/AdminNavbar";
import {
  FaUsers,
  FaClipboardList,
  FaCar,
  FaHotel,
  FaMapMarkedAlt,
  FaBullseye,
} from "react-icons/fa";

const Tile = ({ to, icon: Icon, title, color = "#2d5a27", description }) => (
  <Link
    to={to}
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: "white",
      border: "1px solid #e8f5e8",
      borderRadius: "12px",
      padding: "24px",
      textDecoration: "none",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      transition:
        "transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease",
      position: "relative",
      overflow: "hidden",
      cursor: "pointer",
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = "translateY(-6px) scale(1.02)";
      e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)";
      e.currentTarget.style.backgroundColor = "#f8f9fa";
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = "translateY(0) scale(1)";
      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
      e.currentTarget.style.backgroundColor = "white";
    }}
    onFocus={(e) => {
      e.currentTarget.style.transform = "translateY(-6px) scale(1.02)";
      e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)";
      e.currentTarget.style.backgroundColor = "#f8f9fa";
    }}
    onBlur={(e) => {
      e.currentTarget.style.transform = "translateY(0) scale(1)";
      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
      e.currentTarget.style.backgroundColor = "white";
    }}
    role="button"
    aria-label={`Navigate to ${title}`}
    tabIndex={0}
  >
    <div style={{ fontSize: "40px", color, marginBottom: "12px" }}>
      <Icon />
    </div>
    <div
      style={{ color, fontWeight: 700, fontSize: "18px", textAlign: "center" }}
    >
      {title}
    </div>
    <div
      style={{
        color: "#6c757d",
        fontSize: "14px",
        textAlign: "center",
        marginTop: "8px",
        opacity: 0.8,
      }}
    >
      {description}
    </div>
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "4px",
        background: `linear-gradient(90deg, ${color}, ${color}80)`,
        opacity: 0.3,
        transition: "opacity 0.3s ease",
      }}
    />
  </Link>
);

const AdminDashboard = () => {
  const userName = localStorage.getItem("userName") || "Admin";
  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      <AdminNavbar />
      <div style={{ padding: "32px", maxWidth: "1280px", margin: "0 auto" }}>
        <div
          style={{
            borderRadius: "16px",
            padding: "32px",
            marginBottom: "32px",
            color: "white",
            background: `
            linear-gradient(135deg, rgba(0,0,0,0.5), rgba(0,0,0,0.65)),
            url('https://images.unsplash.com/photo-1504608245011-62bb557b31b0?q=80&w=1200&auto=format&fit=crop') center/cover no-repeat
          `,
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(74,124,89,0.2), rgba(232,245,232,0.1))",
              zIndex: 0,
            }}
          />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h1
              style={{
                margin: 0,
                fontSize: "28px",
                fontWeight: 800,
                letterSpacing: "-0.02em",
              }}
            >
              Welcome, {userName}
            </h1>
            <p
              style={{
                margin: "8px 0 0",
                fontSize: "16px",
                opacity: 0.9,
                maxWidth: "600px",
              }}
            >
              Manage all platform resources efficiently from this dashboard. Use
              the tiles below to navigate to specific management sections.
            </p>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "24px",
            padding: "0 8px",
          }}
        >
          <Tile
            to="/admin/users"
            icon={FaUsers}
            title="Manage Users"
            description="View and edit user accounts and permissions"
          />
          <Tile
            to="/admin/bookings"
            icon={FaClipboardList}
            title="Manage Bookings"
            color="#dc3545"
            description="Oversee all customer bookings and statuses"
          />
          <Tile
            to="/admin/transport"
            icon={FaCar}
            title="Manage Transport Providers"
            description="Handle transport services and providers"
          />
          <Tile
            to="/admin/accommodations"
            icon={FaHotel}
            title="Manage Accommodations"
            description="Add or update hotels, villas, and more"
          />
          <Tile
            to="/admin/locations"
            icon={FaMapMarkedAlt}
            title="Manage Locations"
            description="Curate destination details and highlights"
          />
          <Tile
            to="/admin/activities"
            icon={FaBullseye}
            title="Manage Leisure Activities"
            description="Organize tours, adventures, and events"
          />
        </div>
      </div>
      <style>
        {`
          @media (max-width: 768px) {
            .dashboard-container { padding: 16px; }
            .header { padding: 24px; }
            .header h1 { font-size: 22px; }
            .header p { font-size: 14px; }
            .tile-grid { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
          }
          @media (max-width: 480px) {
            .dashboard-container { padding: 12px; }
            .header { padding: 16px; }
            .header h1 { font-size: 20px; }
            .tile-grid { grid-template-columns: 1fr; }
          }
          .tile:hover .tile-bar { opacity: 0.6; }
        `}
      </style>
    </div>
  );
};

export default AdminDashboard;
