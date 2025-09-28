import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { FaFileDownload } from "react-icons/fa";
import AdminNavbar from "./AdminNavbar";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [userTotals, setUserTotals] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState({});
  const baseUrl = "http://localhost:5000";
  const bookingsPerPage = 10;

  const loadBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      const { data } = await axios.get(`${baseUrl}/api/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(data);

      const userIds = [
        ...new Set(data.map((booking) => booking.userId).filter(Boolean)),
      ];
      const totals = {};
      for (const userId of userIds) {
        const { data: totalData } = await axios.get(
          `${baseUrl}/api/bookings/total/by-user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        totals[userId] = totalData.total;
      }
      setUserTotals(totals);
      setError(null);
    } catch (e) {
      setError(
        e.response?.data?.error || e.message || "Failed to load bookings"
      );
      console.error("Error loading bookings:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const confirmBooking = async (id) => {
    try {
      setActionLoading((prev) => ({
        ...prev,
        [id]: { ...prev[id], confirm: true },
      }));
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      await axios.put(
        `${baseUrl}/api/bookings/${id}/confirm`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      loadBookings();
    } catch (e) {
      alert(e.response?.data?.error || "Failed to confirm booking");
      console.error("Error confirming booking:", e);
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        [id]: { ...prev[id], confirm: false },
      }));
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      setActionLoading((prev) => ({
        ...prev,
        [id]: { ...prev[id], status: true },
      }));
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      await axios.put(
        `${baseUrl}/api/bookings/${id}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      loadBookings();
    } catch (e) {
      alert(e.response?.data?.error || "Failed to update booking status");
      console.error("Error updating booking status:", e);
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        [id]: { ...prev[id], status: false },
      }));
    }
  };

  const approveBooking = async (id) => {
    try {
      setActionLoading((prev) => ({
        ...prev,
        [id]: { ...prev[id], approve: true },
      }));
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      await axios.put(
        `${baseUrl}/api/bookings/${id}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      loadBookings();
    } catch (e) {
      alert(e.response?.data?.error || "Failed to approve booking");
      console.error("Error approving booking:", e);
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        [id]: { ...prev[id], approve: false },
      }));
    }
  };

  const rejectBooking = async (id) => {
    try {
      setActionLoading((prev) => ({
        ...prev,
        [id]: { ...prev[id], reject: true },
      }));
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      await axios.put(
        `${baseUrl}/api/bookings/${id}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      loadBookings();
    } catch (e) {
      alert(e.response?.data?.error || "Failed to reject booking");
      console.error("Error rejecting booking:", e);
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        [id]: { ...prev[id], reject: false },
      }));
    }
  };

  const markAsPaid = async (id) => {
    try {
      setActionLoading((prev) => ({
        ...prev,
        [id]: { ...prev[id], pay: true },
      }));
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      await axios.put(
        `${baseUrl}/api/bookings/${id}/pay`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      loadBookings();
    } catch (e) {
      alert(e.response?.data?.error || "Failed to mark booking as paid");
      console.error("Error marking booking as paid:", e);
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        [id]: { ...prev[id], pay: false },
      }));
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?"))
      return;
    try {
      setActionLoading((prev) => ({
        ...prev,
        [id]: { ...prev[id], delete: true },
      }));
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      await axios.delete(`${baseUrl}/api/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadBookings();
    } catch (e) {
      alert(e.response?.data?.error || "Failed to delete booking");
      console.error("Error deleting booking:", e);
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        [id]: { ...prev[id], delete: false },
      }));
    }
  };

  const generateReport = () => {
    const loadScripts = () => {
      return new Promise((resolve, reject) => {
        const jspdfScript = document.createElement("script");
        jspdfScript.src =
          "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
        jspdfScript.onload = () => {
          const autoTableScript = document.createElement("script");
          autoTableScript.src =
            "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js";
          autoTableScript.onload = resolve;
          autoTableScript.onerror = reject;
          document.body.appendChild(autoTableScript);
        };
        jspdfScript.onerror = reject;
        document.body.appendChild(jspdfScript);
      });
    };

    loadScripts()
      .then(() => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const reportDate = new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        const reportTime = new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        // Load logo image
        const logo = new Image();
        logo.src = "/assets/logo.jpg";
        logo.crossOrigin = "Anonymous";

        logo.onload = () => {
          // Add logo centered
          const pageWidth = doc.internal.pageSize.getWidth();
          const logoWidth = 40;
          const logoHeight = (logo.height / logo.width) * logoWidth;
          const logoX = (pageWidth - logoWidth) / 2;
          doc.addImage(logo, "JPEG", logoX, 10, logoWidth, logoHeight);

          // Add title
          doc.setFontSize(20);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(45, 90, 39); // #2d5a27
          doc.text(
            "Booking Management Report",
            pageWidth / 2,
            20 + logoHeight + 10,
            { align: "center" }
          );

          // Add date and time
          doc.setFontSize(12);
          doc.setFont("helvetica", "italic");
          doc.setTextColor(100);
          doc.text(
            `Generated on ${reportDate} at ${reportTime}`,
            pageWidth / 2,
            20 + logoHeight + 20,
            { align: "center" }
          );

          // Prepare table data
          const tableData = filteredBookings.map((booking) => [
            booking.bookingId || "N/A",
            booking.customerName || "Unknown",
            booking.providerName || "Unknown",
            `${booking.currency || "USD"} ${
              booking.totalPrice?.toFixed(2) || "0.00"
            }`,
            booking.status || "Unknown",
            booking.adminStatus || "Unknown",
            booking.userConfirmed ? "Yes" : "No",
            booking.paymentStatus || "Pending",
            booking.createdAt
              ? format(new Date(booking.createdAt), "MM/dd/yyyy")
              : "N/A",
          ]);

          // Calculate summary
          const totalBookings = filteredBookings.length;
          const totalRevenue = filteredBookings.reduce(
            (sum, booking) => sum + (booking.totalPrice || 0),
            0
          );
          const averagePrice =
            totalBookings > 0 ? (totalRevenue / totalBookings).toFixed(2) : 0;
          const statusCounts = filteredBookings.reduce((acc, booking) => {
            acc[booking.status || "Unknown"] =
              (acc[booking.status || "Unknown"] || 0) + 1;
            return acc;
          }, {});
          const adminStatusCounts = filteredBookings.reduce((acc, booking) => {
            acc[booking.adminStatus || "Unknown"] =
              (acc[booking.adminStatus || "Unknown"] || 0) + 1;
            return acc;
          }, {});
          const paymentStatusCounts = filteredBookings.reduce(
            (acc, booking) => {
              acc[booking.paymentStatus || "Pending"] =
                (acc[booking.paymentStatus || "Pending"] || 0) + 1;
              return acc;
            },
            {}
          );
          const comprehensiveCount = filteredBookings.filter(
            (booking) =>
              Array.isArray(booking.specialRequests) &&
              booking.specialRequests.includes("Comprehensive booking")
          ).length;

          // Add table using autoTable
          doc.autoTable({
            startY: 20 + logoHeight + 30,
            head: [
              [
                "Booking ID",
                "Customer",
                "Service",
                "Total Price",
                "Status",
                "Admin Status",
                "User Confirmed",
                "Payment Status",
                "Date",
              ],
            ],
            body: tableData,
            theme: "grid",
            styles: {
              font: "helvetica",
              fontSize: 10,
              cellPadding: 4,
              lineColor: [74, 124, 89], // #4a7c59
              lineWidth: 0.1,
              textColor: [45, 90, 39], // #2d5a27
            },
            headStyles: {
              fillColor: [232, 245, 232], // #e8f5e8
              textColor: [45, 90, 39], // #2d5a27
              fontStyle: "bold",
              halign: "center",
            },
            alternateRowStyles: {
              fillColor: [248, 249, 250], // Light gray for alternate rows
            },
            margin: { left: 10, right: 10 },
            columnStyles: {
              0: { cellWidth: 20, halign: "left" },
              1: { cellWidth: 30, halign: "left" },
              2: { cellWidth: 30, halign: "left" },
              3: { cellWidth: 20, halign: "right" },
              4: { cellWidth: 20, halign: "center" },
              5: { cellWidth: 20, halign: "center" },
              6: { cellWidth: 20, halign: "center" },
              7: { cellWidth: 20, halign: "center" },
              8: { cellWidth: 20, halign: "center" },
            },
            didDrawPage: (data) => {
              // Footer
              doc.setFontSize(8);
              doc.setTextColor(150);
              doc.text(
                `Generated on ${reportDate} at ${reportTime}`,
                data.settings.margin.left,
                doc.internal.pageSize.height - 10
              );
              doc.text(
                `Page ${
                  doc.getCurrentPageInfo().pageNumber
                } of ${doc.getNumberOfPages()}`,
                doc.internal.pageSize.width - data.settings.margin.right,
                doc.internal.pageSize.height - 10,
                { align: "right" }
              );
            },
          });

          // Add summary section below the table
          const finalY = doc.lastAutoTable.finalY + 10;
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(45, 90, 39);
          doc.text("Summary", 10, finalY);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.setTextColor(0);
          doc.text(`Total Bookings: ${totalBookings}`, 10, finalY + 10);
          doc.text(
            `Total Revenue: ${
              filteredBookings[0]?.currency || "USD"
            } ${totalRevenue.toFixed(2)}`,
            10,
            finalY + 15
          );
          doc.text(
            `Average Booking Price: ${
              filteredBookings[0]?.currency || "USD"
            } ${averagePrice}`,
            10,
            finalY + 20
          );
          doc.text(
            `Comprehensive Bookings: ${comprehensiveCount}`,
            10,
            finalY + 25
          );
          doc.text("Bookings by Status:", 10, finalY + 30);
          let offsetY = finalY + 35;
          Object.entries(statusCounts).forEach(([status, count]) => {
            doc.text(`${status}: ${count}`, 15, offsetY);
            offsetY += 5;
          });
          doc.text("Bookings by Admin Status:", 10, offsetY);
          offsetY += 5;
          Object.entries(adminStatusCounts).forEach(([status, count]) => {
            doc.text(`${status}: ${count}`, 15, offsetY);
            offsetY += 5;
          });
          doc.text("Bookings by Payment Status:", 10, offsetY);
          offsetY += 5;
          Object.entries(paymentStatusCounts).forEach(([status, count]) => {
            doc.text(`${status}: ${count}`, 15, offsetY);
            offsetY += 5;
          });

          // Save the PDF
          doc.save(`Booking_Report_${reportDate.replace(/, /g, "_")}.pdf`);
        };

        logo.onerror = () => {
          console.error("Failed to load logo");
          const pageWidth = doc.internal.pageSize.getWidth();

          // Add title without logo
          doc.setFontSize(20);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(45, 90, 39);
          doc.text("Booking Management Report", pageWidth / 2, 20, {
            align: "center",
          });

          // Add date and time
          doc.setFontSize(12);
          doc.setFont("helvetica", "italic");
          doc.setTextColor(100);
          doc.text(
            `Generated on ${reportDate} at ${reportTime}`,
            pageWidth / 2,
            30,
            { align: "center" }
          );

          // Prepare table data
          const tableData = filteredBookings.map((booking) => [
            booking.bookingId || "N/A",
            booking.customerName || "Unknown",
            booking.providerName || "Unknown",
            `${booking.currency || "USD"} ${
              booking.totalPrice?.toFixed(2) || "0.00"
            }`,
            booking.status || "Unknown",
            booking.adminStatus || "Unknown",
            booking.userConfirmed ? "Yes" : "No",
            booking.paymentStatus || "Pending",
            booking.createdAt
              ? format(new Date(booking.createdAt), "MM/dd/yyyy")
              : "N/A",
          ]);

          // Calculate summary
          const totalBookings = filteredBookings.length;
          const totalRevenue = filteredBookings.reduce(
            (sum, booking) => sum + (booking.totalPrice || 0),
            0
          );
          const averagePrice =
            totalBookings > 0 ? (totalRevenue / totalBookings).toFixed(2) : 0;
          const statusCounts = filteredBookings.reduce((acc, booking) => {
            acc[booking.status || "Unknown"] =
              (acc[booking.status || "Unknown"] || 0) + 1;
            return acc;
          }, {});
          const adminStatusCounts = filteredBookings.reduce((acc, booking) => {
            acc[booking.adminStatus || "Unknown"] =
              (acc[booking.adminStatus || "Unknown"] || 0) + 1;
            return acc;
          }, {});
          const paymentStatusCounts = filteredBookings.reduce(
            (acc, booking) => {
              acc[booking.paymentStatus || "Pending"] =
                (acc[booking.paymentStatus || "Pending"] || 0) + 1;
              return acc;
            },
            {}
          );
          const comprehensiveCount = filteredBookings.filter(
            (booking) =>
              Array.isArray(booking.specialRequests) &&
              booking.specialRequests.includes("Comprehensive booking")
          ).length;

          doc.autoTable({
            startY: 40,
            head: [
              [
                "Booking ID",
                "Customer",
                "Service",
                "Total Price",
                "Status",
                "Admin Status",
                "User Confirmed",
                "Payment Status",
                "Date",
              ],
            ],
            body: tableData,
            theme: "grid",
            styles: {
              font: "helvetica",
              fontSize: 10,
              cellPadding: 4,
              lineColor: [74, 124, 89],
              lineWidth: 0.1,
              textColor: [45, 90, 39],
            },
            headStyles: {
              fillColor: [232, 245, 232],
              textColor: [45, 90, 39],
              fontStyle: "bold",
              halign: "center",
            },
            alternateRowStyles: {
              fillColor: [248, 249, 250],
            },
            margin: { left: 10, right: 10 },
            columnStyles: {
              0: { cellWidth: 20, halign: "left" },
              1: { cellWidth: 30, halign: "left" },
              2: { cellWidth: 30, halign: "left" },
              3: { cellWidth: 20, halign: "right" },
              4: { cellWidth: 20, halign: "center" },
              5: { cellWidth: 20, halign: "center" },
              6: { cellWidth: 20, halign: "center" },
              7: { cellWidth: 20, halign: "center" },
              8: { cellWidth: 20, halign: "center" },
            },
            didDrawPage: (data) => {
              // Footer
              doc.setFontSize(8);
              doc.setTextColor(150);
              doc.text(
                `Generated on ${reportDate} at ${reportTime}`,
                data.settings.margin.left,
                doc.internal.pageSize.height - 10
              );
              doc.text(
                `Page ${
                  doc.getCurrentPageInfo().pageNumber
                } of ${doc.getNumberOfPages()}`,
                doc.internal.pageSize.width - data.settings.margin.right,
                doc.internal.pageSize.height - 10,
                { align: "right" }
              );
            },
          });

          // Add summary section
          const finalY = doc.lastAutoTable.finalY + 10;
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(45, 90, 39);
          doc.text("Summary", 10, finalY);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.setTextColor(0);
          doc.text(`Total Bookings: ${totalBookings}`, 10, finalY + 10);
          doc.text(
            `Total Revenue: ${
              filteredBookings[0]?.currency || "USD"
            } ${totalRevenue.toFixed(2)}`,
            10,
            finalY + 15
          );
          doc.text(
            `Average Booking Price: ${
              filteredBookings[0]?.currency || "USD"
            } ${averagePrice}`,
            10,
            finalY + 20
          );
          doc.text(
            `Comprehensive Bookings: ${comprehensiveCount}`,
            10,
            finalY + 25
          );
          doc.text("Bookings by Status:", 10, finalY + 30);
          let offsetY = finalY + 35;
          Object.entries(statusCounts).forEach(([status, count]) => {
            doc.text(`${status}: ${count}`, 15, offsetY);
            offsetY += 5;
          });
          doc.text("Bookings by Admin Status:", 10, offsetY);
          offsetY += 5;
          Object.entries(adminStatusCounts).forEach(([status, count]) => {
            doc.text(`${status}: ${count}`, 15, offsetY);
            offsetY += 5;
          });
          doc.text("Bookings by Payment Status:", 10, offsetY);
          offsetY += 5;
          Object.entries(paymentStatusCounts).forEach(([status, count]) => {
            doc.text(`${status}: ${count}`, 15, offsetY);
            offsetY += 5;
          });

          doc.save(`Booking_Report_${reportDate.replace(/, /g, "_")}.pdf`);
        };
      })
      .catch((error) => {
        console.error("Failed to load jsPDF or autoTable", error);
        alert("Failed to generate report. Please try again.");
      });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#ffc107",
      confirmed: "#28a745",
      cancelled: "#dc3545",
    };
    return colors[status] || "#6c757d";
  };

  const getAdminStatusColor = (adminStatus) => {
    const colors = {
      pending: "#ffc107",
      approved: "#28a745",
      rejected: "#dc3545",
    };
    return colors[adminStatus] || "#6c757d";
  };

  const getPaymentStatusColor = (paymentStatus) => {
    const colors = {
      pending: "#ffc107",
      paid: "#28a745",
    };
    return colors[paymentStatus] || "#6c757d";
  };

  const filteredBookings = bookings
    .filter((booking) => {
      if (filter === "all") return true;
      if (filter === "pending")
        return (
          booking.status === "pending" || booking.adminStatus === "pending"
        );
      if (filter === "confirmed") return booking.status === "confirmed";
      if (filter === "cancelled") return booking.status === "cancelled";
      if (filter === "comprehensive") {
        return (
          Array.isArray(booking.specialRequests) &&
          booking.specialRequests.includes("Comprehensive booking")
        );
      }
      return true;
    })
    .filter((booking) => {
      if (!search) return true;
      const searchLower = search.toLowerCase();
      return (
        booking.bookingId?.toLowerCase().includes(searchLower) ||
        booking.customerName?.toLowerCase().includes(searchLower)
      );
    });

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  const SkeletonRow = () => (
    <tr style={{ borderBottom: "1px solid #eee", backgroundColor: "#fff" }}>
      {Array(9)
        .fill()
        .map((_, index) => (
          <td key={index} style={{ padding: "12px", minWidth: "100px" }}>
            <div
              style={{
                backgroundColor: "#e8f5e8",
                height: "16px",
                borderRadius: "4px",
                animation: "pulse 1.5s infinite",
              }}
            />
          </td>
        ))}
    </tr>
  );

  if (loading) {
    return (
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          minHeight: "100vh",
          backgroundColor: "#f8f9fa",
        }}
      >
        <AdminNavbar />
        <div style={{ padding: "16px", maxWidth: "1400px", margin: "0 auto" }}>
          <h2
            style={{
              color: "#2d5a27",
              fontSize: "20px",
              fontWeight: "600",
              marginBottom: "16px",
            }}
          >
            Manage Bookings
          </h2>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f0f7f0" }}>
                  {[
                    "Booking ID",
                    "Customer",
                    "Service",
                    "Total Price",
                    "Status",
                    "Admin Status",
                    "User Confirmed",
                    "Payment Status",
                    "Date",
                  ].map((header) => (
                    <th
                      key={header}
                      style={{
                        padding: "12px",
                        textAlign: "left",
                        borderBottom: "2px solid #4a7c59",
                        fontWeight: "600",
                        color: "#2d5a27",
                        fontSize: "14px",
                        minWidth: header === "Actions" ? "200px" : "100px",
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array(5)
                  .fill()
                  .map((_, index) => (
                    <SkeletonRow key={index} />
                  ))}
              </tbody>
            </table>
          </div>
          <style>
            {`
              @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.5; }
                100% { opacity: 1; }
              }
            `}
          </style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          minHeight: "100vh",
          backgroundColor: "#f8f9fa",
        }}
      >
        <AdminNavbar />
        <div
          style={{
            padding: "16px",
            textAlign: "center",
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#dc3545" }}>
            Error
          </h2>
          <p style={{ color: "#dc3545", fontSize: "14px", margin: "8px 0" }}>
            {error}
          </p>
          <button
            onClick={loadBookings}
            style={{
              padding: "8px 16px",
              background: "linear-gradient(135deg, #007bff, #0056b3)",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      <AdminNavbar />
      <div style={{ padding: "16px", maxWidth: "1400px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginBottom: "16px",
            backgroundColor: "white",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{
              color: "#2d5a27",
              fontSize: "20px",
              fontWeight: "600",
              margin: 0,
            }}
          >
            Manage Bookings
          </h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by Booking ID or Customer Name"
              style={{
                padding: "8px",
                border: "1px solid #e8f5e8",
                borderRadius: "6px",
                fontSize: "14px",
                width: "200px",
                flex: "1 1 200px",
              }}
              aria-label="Search bookings"
            />
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                padding: "8px",
                border: "1px solid #e8f5e8",
                borderRadius: "6px",
                fontSize: "14px",
                backgroundColor: "white",
                color: "#2d5a27",
                fontWeight: "600",
                flex: "0 1 180px",
              }}
              aria-label="Filter bookings"
            >
              <option value="all">All Bookings</option>
              <option value="pending">Pending Bookings</option>
              <option value="confirmed">Confirmed Bookings</option>
              <option value="cancelled">Cancelled Bookings</option>
              <option value="comprehensive">Comprehensive Bookings</option>
            </select>
            <button
              onClick={loadBookings}
              style={{
                padding: "8px 16px",
                background: "linear-gradient(135deg, #007bff, #0056b3)",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
                flex: "0 1 auto",
              }}
              aria-label="Refresh bookings"
            >
              Refresh
            </button>
            <button
              onClick={generateReport}
              style={{
                padding: "8px 16px",
                background: "linear-gradient(135deg, #28a745, #218838)",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
                flex: "0 1 auto",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
              disabled={filteredBookings.length === 0}
              aria-label="Generate report"
            >
              <FaFileDownload /> Generate Report
            </button>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e8f5e8",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table
              style={{ width: "100%", borderCollapse: "collapse" }}
              role="grid"
              aria-label="Bookings table"
            >
              <thead>
                <tr style={{ backgroundColor: "#f0f7f0" }}>
                  {[
                    "Booking ID",
                    "Customer",
                    "Service",
                    "Total Price",
                    "Status",
                    "Admin Status",
                    "User Confirmed",
                    "Payment Status",
                    "Date",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      style={{
                        padding: "12px",
                        textAlign: "left",
                        borderBottom: "2px solid #4a7c59",
                        fontWeight: "600",
                        color: "#2d5a27",
                        fontSize: "14px",
                        minWidth: header === "Actions" ? "200px" : "100px",
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentBookings.map((booking, index) => (
                  <tr
                    key={booking._id}
                    style={{
                      borderBottom: "1px solid #eee",
                      backgroundColor: index % 2 ? "#f9fafa" : "#fff",
                    }}
                  >
                    <td
                      style={{
                        padding: "12px",
                        fontWeight: "600",
                        color: "#2d5a27",
                        fontSize: "14px",
                      }}
                    >
                      {booking.bookingId || "N/A"}
                    </td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>
                      <div style={{ fontWeight: "600", color: "#2d5a27" }}>
                        {booking.customerName || "Unknown"}
                      </div>
                      <div style={{ color: "#666", fontSize: "12px" }}>
                        {booking.customerEmail || "N/A"}
                      </div>
                      {booking.userId && userTotals[booking.userId] && (
                        <div style={{ color: "#4a7c59", fontSize: "12px" }}>
                          Total: {booking.currency || "USD"}{" "}
                          {userTotals[booking.userId].toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>
                      <div style={{ fontWeight: "600", color: "#2d5a27" }}>
                        {booking.providerName || "Unknown"}
                      </div>
                      <div style={{ color: "#666", fontSize: "12px" }}>
                        {booking.vehicleType || "N/A"}
                      </div>
                      {Array.isArray(booking.specialRequests) &&
                        booking.specialRequests.includes(
                          "Comprehensive booking"
                        ) && (
                          <span
                            style={{
                              fontSize: "12px",
                              color: "#4a7c59",
                              backgroundColor: "#f0f7f0",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              display: "inline-block",
                              marginTop: "4px",
                            }}
                          >
                            Comprehensive
                          </span>
                        )}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        fontWeight: "600",
                        color: "#2d5a27",
                        fontSize: "14px",
                      }}
                    >
                      {booking.currency || "USD"}{" "}
                      {booking.totalPrice?.toFixed(2) || "0.00"}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "600",
                          backgroundColor:
                            getStatusColor(booking.status) + "20",
                          color: getStatusColor(booking.status),
                        }}
                      >
                        {booking.status || "Unknown"}
                      </span>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "600",
                          backgroundColor:
                            getAdminStatusColor(booking.adminStatus) + "20",
                          color: getAdminStatusColor(booking.adminStatus),
                        }}
                      >
                        {booking.adminStatus || "Unknown"}
                      </span>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "600",
                          backgroundColor: booking.userConfirmed
                            ? "#28a74520"
                            : "#ffc10720",
                          color: booking.userConfirmed ? "#28a745" : "#ffc107",
                        }}
                      >
                        {booking.userConfirmed ? "Yes" : "No"}
                      </span>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "600",
                          backgroundColor:
                            getPaymentStatusColor(booking.paymentStatus) + "20",
                          color: getPaymentStatusColor(booking.paymentStatus),
                        }}
                      >
                        {booking.paymentStatus || "Pending"}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        fontSize: "12px",
                        color: "#666",
                      }}
                    >
                      {booking.createdAt
                        ? format(new Date(booking.createdAt), "MM/dd/yyyy")
                        : "N/A"}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: "6px",
                          flexWrap: "wrap",
                        }}
                      >
                        {!booking.userConfirmed && (
                          <button
                            onClick={() => confirmBooking(booking._id)}
                            disabled={actionLoading[booking._id]?.confirm}
                            style={{
                              padding: "6px 10px",
                              background: actionLoading[booking._id]?.confirm
                                ? "#d3d4d5"
                                : "#17a2b8",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              fontSize: "12px",
                              cursor: actionLoading[booking._id]?.confirm
                                ? "not-allowed"
                                : "pointer",
                              position: "relative",
                            }}
                            aria-label={`Confirm booking ${
                              booking.bookingId || booking._id
                            }`}
                            title="Confirm user booking"
                          >
                            {actionLoading[booking._id]?.confirm
                              ? "Confirming..."
                              : "Confirm"}
                          </button>
                        )}
                        {booking.adminStatus === "pending" && (
                          <>
                            <button
                              onClick={() => approveBooking(booking._id)}
                              disabled={actionLoading[booking._id]?.approve}
                              style={{
                                padding: "6px 10px",
                                background: actionLoading[booking._id]?.approve
                                  ? "#d3d4d5"
                                  : "#28a745",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                fontSize: "12px",
                                cursor: actionLoading[booking._id]?.approve
                                  ? "not-allowed"
                                  : "pointer",
                                position: "relative",
                              }}
                              aria-label={`Approve booking ${
                                booking.bookingId || booking._id
                              }`}
                              title="Approve booking"
                            >
                              {actionLoading[booking._id]?.approve
                                ? "Approving..."
                                : "Approve"}
                            </button>
                            <button
                              onClick={() => rejectBooking(booking._id)}
                              disabled={actionLoading[booking._id]?.reject}
                              style={{
                                padding: "6px 10px",
                                background: actionLoading[booking._id]?.reject
                                  ? "#d3d4d5"
                                  : "#dc3545",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                fontSize: "12px",
                                cursor: actionLoading[booking._id]?.reject
                                  ? "not-allowed"
                                  : "pointer",
                                position: "relative",
                              }}
                              aria-label={`Reject booking ${
                                booking.bookingId || booking._id
                              }`}
                              title="Reject booking"
                            >
                              {actionLoading[booking._id]?.reject
                                ? "Rejecting..."
                                : "Reject"}
                            </button>
                          </>
                        )}
                        {booking.adminStatus === "approved" &&
                          booking.paymentStatus !== "paid" && (
                            <button
                              onClick={() => markAsPaid(booking._id)}
                              disabled={actionLoading[booking._id]?.pay}
                              style={{
                                padding: "6px 10px",
                                background: actionLoading[booking._id]?.pay
                                  ? "#d3d4d5"
                                  : "#007bff",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                fontSize: "12px",
                                cursor: actionLoading[booking._id]?.pay
                                  ? "not-allowed"
                                  : "pointer",
                                position: "relative",
                              }}
                              aria-label={`Mark as paid for booking ${
                                booking.bookingId || booking._id
                              }`}
                              title="Mark booking as paid"
                            >
                              {actionLoading[booking._id]?.pay
                                ? "Marking..."
                                : "Paid"}
                            </button>
                          )}
                        <button
                          onClick={() =>
                            updateBookingStatus(booking._id, "cancelled")
                          }
                          disabled={actionLoading[booking._id]?.status}
                          style={{
                            padding: "6px 10px",
                            background: actionLoading[booking._id]?.status
                              ? "#d3d4d5"
                              : "#6c757d",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "12px",
                            cursor: actionLoading[booking._id]?.status
                              ? "not-allowed"
                              : "pointer",
                            position: "relative",
                          }}
                          aria-label={`Cancel booking ${
                            booking.bookingId || booking._id
                          }`}
                          title="Cancel booking"
                        >
                          {actionLoading[booking._id]?.status
                            ? "Cancelling..."
                            : "Cancel"}
                        </button>
                        <button
                          onClick={() => deleteBooking(booking._id)}
                          disabled={actionLoading[booking._id]?.delete}
                          style={{
                            padding: "6px 10px",
                            background: actionLoading[booking._id]?.delete
                              ? "#d3d4d5"
                              : "#343a40",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "12px",
                            cursor: actionLoading[booking._id]?.delete
                              ? "not-allowed"
                              : "pointer",
                            position: "relative",
                          }}
                          aria-label={`Delete booking ${
                            booking.bookingId || booking._id
                          }`}
                          title="Delete booking"
                        >
                          {actionLoading[booking._id]?.delete
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBookings.length === 0 && (
            <div
              style={{
                padding: "32px",
                textAlign: "center",
                color: "#666",
                backgroundColor: "#fff",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>📋</div>
              <p style={{ fontSize: "14px" }}>
                No bookings found for the selected filter or search.
              </p>
              <button
                onClick={() => {
                  setFilter("all");
                  setSearch("");
                  setCurrentPage(1);
                }}
                style={{
                  padding: "8px 16px",
                  background: "linear-gradient(135deg, #007bff, #0056b3)",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  marginTop: "8px",
                  transition: "all 0.2s ease",
                }}
              >
                Clear Filters
              </button>
            </div>
          )}

          {filteredBookings.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px",
                backgroundColor: "white",
                borderTop: "1px solid #e8f5e8",
              }}
            >
              <div style={{ fontSize: "14px", color: "#666" }}>
                Showing {indexOfFirstBooking + 1} to{" "}
                {Math.min(indexOfLastBooking, filteredBookings.length)} of{" "}
                {filteredBookings.length} bookings
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  style={{
                    padding: "6px 12px",
                    background: currentPage === 1 ? "#d3d4d5" : "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "12px",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  }}
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  style={{
                    padding: "6px 12px",
                    background:
                      currentPage === totalPages ? "#d3d4d5" : "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "12px",
                    cursor:
                      currentPage === totalPages ? "not-allowed" : "pointer",
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>
        {`
          @media (max-width: 768px) {
            table { font-size: 12px; }
            th, td { padding: 8px; min-width: 80px; }
            button { padding: 6px 8px; font-size: 11px; }
            input, select { font-size: 12px; }
          }
          button:hover:not(:disabled) {
            filter: brightness(1.1);
          }
          button:disabled {
            opacity: 0.6;
          }
        `}
      </style>
    </div>
  );
};

export default AdminBookings;
