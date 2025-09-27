import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  const loadBookings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:5000/api/bookings");
      setBookings(data);
      setError(null);
    } catch (e) {
      setError("Failed to load bookings");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const updateBookingStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/${id}/status`, { status });
      loadBookings();
    } catch (e) {
      alert("Failed to update booking status");
      console.error(e);
    }
  };

  const approveBooking = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/${id}/approve`);
      loadBookings();
    } catch (e) {
      alert("Failed to approve booking");
      console.error(e);
    }
  };

  const rejectBooking = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/${id}/reject`);
      loadBookings();
    } catch (e) {
      alert("Failed to reject booking");
      console.error(e);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#ffc107",
      confirmed: "#28a745",
      cancelled: "#dc3545"
    };
    return colors[status] || "#6c757d";
  };

  const getAdminStatusColor = (adminStatus) => {
    const colors = {
      pending: "#ffc107",
      approved: "#28a745",
      rejected: "#dc3545"
    };
    return colors[adminStatus] || "#6c757d";
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === "all") return true;
    if (filter === "pending") return booking.status === "pending";
    if (filter === "confirmed") return booking.status === "confirmed";
    if (filter === "cancelled") return booking.status === "cancelled";
    if (filter === "comprehensive") return booking.specialRequests?.includes("Comprehensive booking");
    return true;
  });

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <div style={{ fontSize: "2rem", marginBottom: "20px" }}>⏳</div>
        <p style={{ color: "#4a7c59", fontSize: "1.1rem" }}>Loading bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <div style={{ fontSize: "2rem", marginBottom: "20px", color: "#dc3545" }}>❌</div>
        <p style={{ color: "#dc3545", fontSize: "1.1rem" }}>{error}</p>
        <button
          onClick={loadBookings}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4a7c59",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginTop: "10px"
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "30px"
      }}>
        <h2 style={{ color: "#2d5a27", fontSize: "2rem", margin: 0 }}>
          Manage Bookings
        </h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: "8px 12px",
              border: "2px solid #e8f5e8",
              borderRadius: "6px",
              backgroundColor: "white",
              color: "#2d5a27",
              fontWeight: "600"
            }}
          >
            <option value="all">All Bookings</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="comprehensive">Comprehensive</option>
          </select>
          <button
            onClick={loadBookings}
            style={{
              padding: "8px 16px",
              backgroundColor: "#4a7c59",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      <div style={{ 
        backgroundColor: "white", 
        borderRadius: "12px", 
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f0f7f0" }}>
                <th style={{ padding: "15px", textAlign: "left", borderBottom: "2px solid #4a7c59" }}>
                  Booking ID
                </th>
                <th style={{ padding: "15px", textAlign: "left", borderBottom: "2px solid #4a7c59" }}>
                  Customer
                </th>
                <th style={{ padding: "15px", textAlign: "left", borderBottom: "2px solid #4a7c59" }}>
                  Service
                </th>
                <th style={{ padding: "15px", textAlign: "left", borderBottom: "2px solid #4a7c59" }}>
                  Total Price
                </th>
                <th style={{ padding: "15px", textAlign: "left", borderBottom: "2px solid #4a7c59" }}>
                  Status
                </th>
                <th style={{ padding: "15px", textAlign: "left", borderBottom: "2px solid #4a7c59" }}>
                  Admin Status
                </th>
                <th style={{ padding: "15px", textAlign: "left", borderBottom: "2px solid #4a7c59" }}>
                  Date
                </th>
                <th style={{ padding: "15px", textAlign: "left", borderBottom: "2px solid #4a7c59" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map(booking => (
                <tr key={booking._id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "15px", fontWeight: "600", color: "#2d5a27" }}>
                    {booking.bookingId}
                  </td>
                  <td style={{ padding: "15px" }}>
                    <div>
                      <div style={{ fontWeight: "600", color: "#2d5a27" }}>
                        {booking.customerName}
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "#666" }}>
                        {booking.customerEmail}
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "#666" }}>
                        {booking.customerPhone}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "15px" }}>
                    <div>
                      <div style={{ fontWeight: "600", color: "#2d5a27" }}>
                        {booking.providerName}
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "#666" }}>
                        {booking.vehicleType}
                      </div>
                      {booking.specialRequests?.includes("Comprehensive booking") && (
                        <div style={{ 
                          fontSize: "0.8rem", 
                          color: "#4a7c59", 
                          backgroundColor: "#f0f7f0",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          marginTop: "4px",
                          display: "inline-block"
                        }}>
                          Comprehensive Package
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "15px", fontWeight: "600", color: "#2d5a27" }}>
                    ${booking.totalPrice}
                  </td>
                  <td style={{ padding: "15px" }}>
                    <span style={{
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                      backgroundColor: getStatusColor(booking.status) + "20",
                      color: getStatusColor(booking.status)
                    }}>
                      {booking.status}
                    </span>
                  </td>
                  <td style={{ padding: "15px" }}>
                    <span style={{
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                      backgroundColor: getAdminStatusColor(booking.adminStatus) + "20",
                      color: getAdminStatusColor(booking.adminStatus)
                    }}>
                      {booking.adminStatus}
                    </span>
                  </td>
                  <td style={{ padding: "15px", fontSize: "0.9rem", color: "#666" }}>
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "15px" }}>
                    <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                      {booking.adminStatus === "pending" && (
                        <>
                          <button
                            onClick={() => approveBooking(booking._id)}
                            style={{
                              padding: "4px 8px",
                              backgroundColor: "#28a745",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              fontSize: "0.8rem",
                              cursor: "pointer"
                            }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectBooking(booking._id)}
                            style={{
                              padding: "4px 8px",
                              backgroundColor: "#dc3545",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              fontSize: "0.8rem",
                              cursor: "pointer"
                            }}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => updateBookingStatus(booking._id, "cancelled")}
                        style={{
                          padding: "4px 8px",
                          backgroundColor: "#6c757d",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          fontSize: "0.8rem",
                          cursor: "pointer"
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredBookings.length === 0 && (
          <div style={{ 
            padding: "40px", 
            textAlign: "center", 
            color: "#666",
            backgroundColor: "#f8f9fa"
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "10px" }}>📋</div>
            <p>No bookings found for the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
