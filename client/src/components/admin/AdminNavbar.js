
import React from "react";
import { Link, useLocation } from "react-router-dom";

const AdminNavbar = () => {
  const location = useLocation();

  const links = [
    { to: "/admin/users", label: "Users" },
    { to: "/admin/bookings", label: "Bookings" },
    { to: "/admin/transport", label: "Transport" },
    { to: "/admin/accommodations", label: "Accommodation" },
    { to: "/admin/locations", label: "Locations" },
    { to: "/admin/activities", label: "Activities" },
  ];

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "linear-gradient(135deg, #2d7a50 0%, #1e5a3a 100%)",
        padding: "16px 32px",
        borderRadius: "0 0 16px 16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {/* Logo / Title */}
      <div style={{ 
        fontSize: "22px", 
        fontWeight: "700", 
        color: "white",
        textShadow: "0 2px 4px rgba(0,0,0,0.3)",
        letterSpacing: "0.5px"
      }}>
        Admin Panel
      </div>

      {/* Links */}
      <div style={{ display: "flex", gap: "12px" }}>
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            style={{
              color:
                location.pathname === link.to
                  ? "#fff"
                  : "rgba(255,255,255,0.85)",
              fontWeight: location.pathname === link.to ? "600" : "500",
              textDecoration: "none",
              padding: "10px 16px",
              borderRadius: "12px",
              background:
                location.pathname === link.to
                  ? "rgba(255,255,255,0.25)"
                  : "rgba(255,255,255,0.1)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              border: "1px solid rgba(255,255,255,0.2)",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.25)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.2)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background =
                location.pathname === link.to
                  ? "rgba(255,255,255,0.25)"
                  : "rgba(255,255,255,0.1)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default AdminNavbar;
