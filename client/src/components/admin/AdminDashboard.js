import React, { useState } from "react";
import AdminUsers from "./AdminUsers";

const AdminDashboard = () => {
  const [tab, setTab] = useState("users");

  const tabButton = (key, label) => (
    <button
      key={key}
      onClick={() => setTab(key)}
      style={{
        padding: "10px 16px",
        borderRadius: 8,
        border: tab === key ? "2px solid #2d7a50" : "1px solid #e0e0e0",
        background: tab === key ? "#eef7f0" : "#fff",
        color: "#2d7a50",
        fontWeight: 700,
        cursor: "pointer"
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ color: "#1f4b1a", marginBottom: 16 }}>Admin Dashboard</h1>

      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        {tabButton("users", "Users")}
      </div>

      <div style={{ background: "#fff", border: "1px solid #e8f5e8", borderRadius: 12, padding: 16 }}>
        {tab === "users" && <AdminUsers />}
      </div>
    </div>
  );
};

export default AdminDashboard;
