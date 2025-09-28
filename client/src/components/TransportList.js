import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaPlus,
  FaTrashAlt,
  FaEdit,
  FaSearch,
  FaFileDownload,
} from "react-icons/fa";
import AdminNavbar from "./admin/AdminNavbar";

const TransportList = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/transport-providers",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProviders(res.data);
      setError(null);
    } catch (err) {
      setError(
        "Failed to fetch transport providers. Please check if the server is running."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProvider = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `http://localhost:5000/api/transport-providers/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProviders(providers.filter((p) => p._id !== id));
        alert("Transport provider deleted successfully!");
      } catch (err) {
        alert("Failed to delete transport provider. Please try again.");
        console.error(err);
      }
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
            "Transport Provider Management Report",
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
          const tableData = filteredProviders.map((provider) => [
            provider.name,
            provider.contact,
            provider.vehicleType,
            provider.description || "-",
            provider.availability ? "Available" : "Not Available",
          ]);

          // Calculate summary
          const totalProviders = filteredProviders.length;
          const availableCount = filteredProviders.filter(
            (provider) => provider.availability
          ).length;
          const vehicleTypeCounts = filteredProviders.reduce(
            (acc, provider) => {
              acc[provider.vehicleType] = (acc[provider.vehicleType] || 0) + 1;
              return acc;
            },
            {}
          );

          // Add table using autoTable
          doc.autoTable({
            startY: 20 + logoHeight + 30,
            head: [
              [
                "Name",
                "Contact",
                "Vehicle Type",
                "Description",
                "Availability",
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
              0: { cellWidth: 40, halign: "left" },
              1: { cellWidth: 40, halign: "left" },
              2: { cellWidth: 30, halign: "center" },
              3: { cellWidth: 50, halign: "left" },
              4: { cellWidth: 30, halign: "center" },
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
          doc.text(`Total Providers: ${totalProviders}`, 10, finalY + 10);
          doc.text(`Available Providers: ${availableCount}`, 10, finalY + 15);
          doc.text("Providers by Vehicle Type:", 10, finalY + 20);
          let offsetY = finalY + 25;
          Object.entries(vehicleTypeCounts).forEach(([type, count]) => {
            doc.text(`${type}: ${count}`, 15, offsetY);
            offsetY += 5;
          });

          // Save the PDF
          doc.save(
            `Transport_Provider_Report_${reportDate.replace(/, /g, "_")}.pdf`
          );
        };

        logo.onerror = () => {
          console.error("Failed to load logo");
          const pageWidth = doc.internal.pageSize.getWidth();

          // Add title without logo
          doc.setFontSize(20);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(45, 90, 39);
          doc.text("Transport Provider Management Report", pageWidth / 2, 20, {
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
          const tableData = filteredProviders.map((provider) => [
            provider.name,
            provider.contact,
            provider.vehicleType,
            provider.description || "-",
            provider.availability ? "Available" : "Not Available",
          ]);

          // Calculate summary
          const totalProviders = filteredProviders.length;
          const availableCount = filteredProviders.filter(
            (provider) => provider.availability
          ).length;
          const vehicleTypeCounts = filteredProviders.reduce(
            (acc, provider) => {
              acc[provider.vehicleType] = (acc[provider.vehicleType] || 0) + 1;
              return acc;
            },
            {}
          );

          doc.autoTable({
            startY: 40,
            head: [
              [
                "Name",
                "Contact",
                "Vehicle Type",
                "Description",
                "Availability",
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
              0: { cellWidth: 40, halign: "left" },
              1: { cellWidth: 40, halign: "left" },
              2: { cellWidth: 30, halign: "center" },
              3: { cellWidth: 50, halign: "left" },
              4: { cellWidth: 30, halign: "center" },
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
          doc.text(`Total Providers: ${totalProviders}`, 10, finalY + 10);
          doc.text(`Available Providers: ${availableCount}`, 10, finalY + 15);
          doc.text("Providers by Vehicle Type:", 10, finalY + 20);
          let offsetY = finalY + 25;
          Object.entries(vehicleTypeCounts).forEach(([type, count]) => {
            doc.text(`${type}: ${count}`, 15, offsetY);
            offsetY += 5;
          });

          doc.save(
            `Transport_Provider_Report_${reportDate.replace(/, /g, "_")}.pdf`
          );
        };
      })
      .catch((error) => {
        console.error("Failed to load jsPDF or autoTable", error);
        alert("Failed to generate report. Please try again.");
      });
  };

  const filteredProviders = providers.filter(
    (provider) =>
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.vehicleType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (provider.description || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px",
          fontSize: "18px",
          color: "#2d5a27",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        Loading transport providers...
      </div>
    );

  if (error)
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px",
          color: "#dc3545",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <h2 style={{ fontSize: "24px", fontWeight: "600" }}>Error</h2>
        <p style={{ fontSize: "16px" }}>{error}</p>
        <button
          onClick={fetchProviders}
          style={{
            padding: "10px 20px",
            background: "linear-gradient(135deg, #007bff, #0056b3)",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            margin: "10px auto",
            fontSize: "14px",
            fontWeight: "600",
            transition: "all 0.2s ease",
          }}
        >
          <FaSearch /> Retry
        </button>
      </div>
    );

  return (
    <div>
      <AdminNavbar />
      <div
        style={{
          padding: "20px",
          maxWidth: "1200px",
          margin: "0 auto",
          fontFamily: "'Inter', sans-serif",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            backgroundColor: "white",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{
              color: "#2d5a27",
              margin: 0,
              fontSize: "22px",
              fontWeight: "600",
            }}
          >
            Transport Provider Management
          </h2>
          <div style={{ display: "flex", gap: "10px" }}>
            <Link
              to="/admin/add"
              style={{
                background: "linear-gradient(135deg, #007bff, #0056b3)",
                color: "white",
                padding: "10px 20px",
                textDecoration: "none",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <FaPlus /> Add New Provider
            </Link>
            <button
              onClick={generateReport}
              style={{
                background: "linear-gradient(135deg, #28a745, #218838)",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
              disabled={filteredProviders.length === 0}
            >
              <FaFileDownload /> Generate Report
            </button>
          </div>
        </div>

        <div style={{ position: "relative", marginBottom: "24px" }}>
          <input
            type="text"
            placeholder="Search transport providers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 40px 12px 16px",
              border: "1px solid #e8f5e8",
              borderRadius: "8px",
              fontSize: "14px",
              backgroundColor: "white",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              transition: "border-color 0.2s ease",
            }}
          />
          <FaSearch
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#6c757d",
            }}
          />
        </div>

        {filteredProviders.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              border: "1px dashed #4a7c59",
            }}
          >
            <h3
              style={{
                color: "#2d5a27",
                marginBottom: "10px",
                fontSize: "18px",
                fontWeight: "600",
              }}
            >
              No Transport Providers Found
            </h3>
            <p style={{ color: "#666", fontSize: "14px" }}>
              Add a new provider or adjust your search.
            </p>
          </div>
        ) : (
          <div
            style={{
              overflowX: "auto",
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: "0",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "linear-gradient(135deg, #f0f7f0, #e8f5e8)",
                  }}
                >
                  {[
                    "Name",
                    "Contact",
                    "Vehicle Type",
                    "Description",
                    "Availability",
                    "Actions",
                  ].map((header, idx) => (
                    <th
                      key={idx}
                      style={{
                        padding: "16px",
                        textAlign: "left",
                        borderBottom: "2px solid #4a7c59",
                        color: "#2d5a27",
                        fontWeight: "600",
                        fontSize: "14px",
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProviders.map((provider) => (
                  <tr
                    key={provider._id}
                    style={{
                      borderBottom: "1px solid #e8f5e8",
                      transition: "background-color 0.2s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f8f9fa")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <td
                      style={{
                        padding: "16px",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {provider.name}
                    </td>
                    <td style={{ padding: "16px", fontSize: "14px" }}>
                      {provider.contact}
                    </td>
                    <td style={{ padding: "16px", fontSize: "14px" }}>
                      {provider.vehicleType}
                    </td>
                    <td style={{ padding: "16px", fontSize: "14px" }}>
                      {provider.description || "-"}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span
                        style={{
                          padding: "6px 16px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600",
                          backgroundColor: provider.availability
                            ? "#d4edda"
                            : "#f8d7da",
                          color: provider.availability ? "#2d5a27" : "#721c24",
                          border: provider.availability
                            ? "1px solid #4a7c59"
                            : "1px solid #dc3545",
                        }}
                      >
                        {provider.availability ? "Available" : "Not Available"}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        display: "flex",
                        gap: "8px",
                        justifyContent: "center",
                      }}
                    >
                      <Link
                        to={`/admin/edit/${provider._id}`}
                        style={{
                          backgroundColor: "#ffc107",
                          color: "#212529",
                          padding: "8px 12px",
                          textDecoration: "none",
                          borderRadius: "6px",
                          fontSize: "12px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          transition: "all 0.2s ease",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                        title="Edit"
                      >
                        <FaEdit /> Edit
                      </Link>
                      <button
                        onClick={() =>
                          deleteProvider(provider._id, provider.name)
                        }
                        style={{
                          backgroundColor: "#dc3545",
                          color: "white",
                          padding: "8px 12px",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "12px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          transition: "all 0.2s ease",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                        title="Delete"
                      >
                        <FaTrashAlt /> Delete
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

export default TransportList;
