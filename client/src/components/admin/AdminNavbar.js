
import React from "react";
import { Link, useLocation } from "react-router-dom";

const AdminNavbar = () => {
  const location = useLocation();

  const links = [
    { to: "/admin/users", label: "Users", emoji: "👥" },
    { to: "/admin/bookings", label: "Bookings", emoji: "📋" },
    { to: "/admin/transport", label: "Transport", emoji: "🚗" },
    { to: "/admin/accommodations", label: "Accommodation", emoji: "🏨" },
    { to: "/admin/locations", label: "Locations", emoji: "🗺️" },
    { to: "/admin/activities", label: "Activities", emoji: "🎯" },
  ];

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#2d7a50",
        padding: "12px 24px",
        borderRadius: "0 0 12px 12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      }}
    >
      {/* Logo / Title */}
      <div style={{ fontSize: 20, fontWeight: 800, color: "white" }}>
        Admin Panel
      </div>

      {/* Links */}
      <div style={{ display: "flex", gap: 20 }}>
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            style={{
              color:
                location.pathname === link.to
                  ? "#fff"
                  : "rgba(255,255,255,0.8)",
              fontWeight: location.pathname === link.to ? "700" : "500",
              textDecoration: "none",
              padding: "6px 12px",
              borderRadius: 6,
              background:
                location.pathname === link.to
                  ? "rgba(255,255,255,0.2)"
                  : "transparent",
              transition: "0.2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.2)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.background =
                location.pathname === link.to
                  ? "rgba(255,255,255,0.2)"
                  : "transparent")
            }
          >
            <span style={{ marginRight: 6 }}>{link.emoji}</span>
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default AdminNavbar;
