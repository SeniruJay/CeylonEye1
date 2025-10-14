import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const baseUrl = "http://localhost:5000";

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = currentUser?._id || currentUser?.id || currentUser?.userId;

  const loadBookings = async () => {
    if (!userId) {
      setError("No user found. Please log in again.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${baseUrl}/api/bookings/all/by-user/${userId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setBookings(data);
      setError(null);
    } catch (e) {
      setError(e.response?.data?.error || e.message || "Failed to load bookings");
      console.error("Error loading user bookings:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onFocus = () => loadBookings();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteBooking = async (id, type) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      setActionLoading((prev) => ({ ...prev, [id]: true }));
      const token = localStorage.getItem("token");
      if (type === 'transport') {
        await axios.delete(`${baseUrl}/api/bookings/${id}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      } else if (type === 'accommodation') {
        await axios.delete(`${baseUrl}/api/bookings-extra/accommodation/${id}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      } else if (type === 'location') {
        await axios.delete(`${baseUrl}/api/bookings-extra/location/${id}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      } else if (type === 'activity') {
        await axios.delete(`${baseUrl}/api/bookings-extra/activity/${id}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      } else {
        await axios.delete(`${baseUrl}/api/bookings/${id}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      }
      setBookings((prev) => prev.filter((b) => b._id !== id));
      // Ensure list is current
      await loadBookings();
    } catch (e) {
      alert(e.response?.data?.error || "Failed to delete booking");
      console.error("Error deleting booking:", e);
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const statusBadge = (text, color) => (
    <span
      style={{
        padding: "4px 8px",
        borderRadius: "999px",
        backgroundColor: color,
        color: "white",
        fontSize: "12px",
        fontWeight: 600,
      }}
    >
      {text}
    </span>
  );

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <h3 style={{ color: "#4a7c59" }}>Loading your bookings...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 1000, margin: "40px auto", padding: 16 }}>
        <h3 style={{ color: "#dc3545" }}>Error</h3>
        <p style={{ color: "#dc3545" }}>{error}</p>
        <button
          onClick={loadBookings}
          style={{
            padding: "8px 16px",
            backgroundColor: "#4a7c59",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "100px auto 40px", padding: "0 16px" }}>
      <div
        style={{
          backgroundColor: "white",
          borderRadius: 12,
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          padding: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <h2 style={{ color: "#2d5a27", margin: 0 }}>My Bookings</h2>
          <button
            onClick={loadBookings}
            style={{
              padding: "8px 12px",
              background: "linear-gradient(135deg, #4a7c59, #2d5a27)",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Refresh
          </button>
        </div>

        {bookings.length === 0 ? (
          <div style={{ textAlign: "center", color: "#6c757d", padding: "40px 0" }}>
            <p>You have no bookings yet.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f0f7f0" }}>
                  {["Booking ID", "Provider", "Vehicle", "Total", "Status", "Admin", "Payment", "Date", "Actions"].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: 12,
                        borderBottom: "2px solid #4a7c59",
                        color: "#2d5a27",
                        fontWeight: 600,
                        fontSize: 14,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: 12 }}>{b.bookingId || "N/A"}</td>
                    <td style={{ padding: 12 }}>{b.providerName || b.providerId?.name || "-"}</td>
                    <td style={{ padding: 12 }}>{b.vehicleType || b.providerId?.vehicleType || "-"}</td>
                    <td style={{ padding: 12 }}>{`${b.currency || "LKR"} ${Number(b.totalPrice || 0).toFixed(2)}`}</td>
                    <td style={{ padding: 12 }}>
                      {statusBadge(b.status || "pending", (b.status === "confirmed" ? "#28a745" : b.status === "cancelled" ? "#dc3545" : "#ffc107"))}
                    </td>
                    <td style={{ padding: 12 }}>
                      {statusBadge(b.adminStatus || "-", (b.adminStatus === "approved" ? "#28a745" : b.adminStatus === "rejected" ? "#dc3545" : "#6c757d"))}
                    </td>
                    <td style={{ padding: 12 }}>
                      {statusBadge(b.paymentStatus || "unpaid", (b.paymentStatus === "paid" ? "#28a745" : "#6c757d"))}
                    </td>
                    <td style={{ padding: 12 }}>{b.createdAt ? format(new Date(b.createdAt), "yyyy-MM-dd") : "-"}</td>
                    <td style={{ padding: 12 }}>
                      <button
                        onClick={() => deleteBooking(b._id, b.type)}
                        disabled={!!actionLoading[b._id]}
                        style={{
                          padding: "6px 10px",
                          backgroundColor: "#dc3545",
                          color: "white",
                          border: "none",
                          borderRadius: 6,
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        {actionLoading[b._id] ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
