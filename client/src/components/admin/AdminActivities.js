import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaPlus,
  FaTrashAlt,
  FaTimes,
  FaEdit,
  FaSearch,
  FaFileDownload,
} from "react-icons/fa";
import AdminNavbar from "./AdminNavbar";

const empty = {
  name: "",
  category: "Other",
  location: "",
  duration: "",
  price: 0,
  availability: true,
  image: null,
};

const AdminActivities = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState(empty);
  const [formErrors, setFormErrors] = useState({
    name: "",
    location: "",
    duration: "",
    price: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const baseUrl = "http://localhost:5000";

  useEffect(() => {
    load();
  }, []);

  const validateForm = () => {
    const errors = {};
    const nameRegex = /^[A-Za-z\s]{2,100}$/;
    const locationRegex = /^[A-Za-z\s]{2,50}$/;
    const durationRegex = /^.{0,50}$/;
    const priceRegex = /^\d+(\.\d{1,2})?$/;

    if (!nameRegex.test(formData.name)) {
      errors.name =
        "Activity name must be 2-100 characters, letters and spaces only";
    }
    if (!locationRegex.test(formData.location)) {
      errors.location =
        "Location must be 2-50 characters, letters and spaces only";
    }
    if (!durationRegex.test(formData.duration)) {
      errors.duration = "Duration must be 0-50 characters";
    }
    if (!priceRegex.test(formData.price.toString()) || formData.price < 0) {
      errors.price =
        "Price must be a non-negative number with up to 2 decimal places";
    }
    if (!editingId && !formData.image) {
      errors.image = "Image is required for new activities";
    }
    if (
      formData.image &&
      !["image/jpeg", "image/png"].includes(formData.image.type)
    ) {
      errors.image = "Only JPEG or PNG images are allowed";
    }
    if (formData.image && formData.image.size > 5 * 1024 * 1024) {
      errors.image = "Image size must be less than 5MB";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const load = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${baseUrl}/api/activities`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(data);
      setError(null);
    } catch (e) {
      setError("Failed to load activities");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const token = localStorage.getItem("token");
      const url = editingId
        ? `${baseUrl}/api/activities/${editingId}`
        : `${baseUrl}/api/activities`;
      const method = editingId ? axios.put : axios.post;
      const data = new FormData();
      data.append("name", formData.name);
      data.append("category", formData.category);
      data.append("location", formData.location);
      data.append("duration", formData.duration);
      data.append("price", formData.price);
      data.append("availability", formData.availability);
      if (formData.image) {
        data.append("image", formData.image);
      }
      await method(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert(
        editingId
          ? "Activity updated successfully!"
          : "Activity created successfully!"
      );
      setShowForm(false);
      setEditingId(null);
      resetForm();
      load();
    } catch (e) {
      alert(
        e.response?.data?.error ||
          (editingId
            ? "Failed to update activity"
            : "Failed to create activity")
      );
      console.error(e);
    }
  };

  const edit = (item) => {
    setEditingId(item._id);
    setFormData({
      name: item.name,
      category: item.category,
      location: item.location,
      duration: item.duration || "",
      price: item.price || 0,
      availability: item.availability,
      image: null,
    });
    setImagePreview(item.image ? `${baseUrl}${item.image}` : null);
    setShowForm(true);
    setFormErrors({});
  };

  const del = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete activity "${name}"?`)) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${baseUrl}/api/activities/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Activity deleted successfully!");
        load();
      } catch (e) {
        alert("Failed to delete activity");
      }
    }
  };

  const resetForm = () => {
    setFormData(empty);
    setFormErrors({});
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const generateReport = () => {
    // Dynamically load jsPDF and jspdf-autotable
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
            "Activity Management Report",
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

          // Prepare table data (excluding images)
          const tableData = filteredItems.map((item) => [
            item.name,
            item.category,
            item.location,
            item.duration || "-",
            `$${item.price.toFixed(2)}`,
            item.availability ? "Available" : "Unavailable",
          ]);

          // Calculate summary
          const totalActivities = filteredItems.length;
          const totalPrice = filteredItems.reduce(
            (sum, item) => sum + item.price,
            0
          );
          const averagePrice =
            totalActivities > 0 ? (totalPrice / totalActivities).toFixed(2) : 0;
          const availableCount = filteredItems.filter(
            (item) => item.availability
          ).length;

          // Add table using autoTable
          doc.autoTable({
            startY: 20 + logoHeight + 30,
            head: [
              [
                "Name",
                "Category",
                "Location",
                "Duration",
                "Price",
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
              0: { cellWidth: 50, halign: "left" },
              1: { cellWidth: 25, halign: "center" },
              2: { cellWidth: 30, halign: "left" },
              3: { cellWidth: 25, halign: "center" },
              4: { cellWidth: 20, halign: "right" },
              5: { cellWidth: 30, halign: "center" },
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
          doc.text(`Total Activities: ${totalActivities}`, 10, finalY + 10);
          doc.text(`Available Activities: ${availableCount}`, 10, finalY + 15);
          doc.text(`Average Price: $${averagePrice}`, 10, finalY + 20);
          doc.text(
            `Total Revenue Potential: $${totalPrice.toFixed(2)}`,
            10,
            finalY + 25
          );

          // Save the PDF
          doc.save(`Activity_Report_${reportDate.replace(/, /g, "_")}.pdf`);
        };

        logo.onerror = () => {
          // Fallback if logo fails to load
          console.error("Failed to load logo");
          const pageWidth = doc.internal.pageSize.getWidth();

          // Add title without logo
          doc.setFontSize(20);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(45, 90, 39);
          doc.text("Activity Management Report", pageWidth / 2, 20, {
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
          const tableData = filteredItems.map((item) => [
            item.name,
            item.category,
            item.location,
            item.duration || "-",
            `$${item.price.toFixed(2)}`,
            item.availability ? "Available" : "Unavailable",
          ]);

          // Calculate summary
          const totalActivities = filteredItems.length;
          const totalPrice = filteredItems.reduce(
            (sum, item) => sum + item.price,
            0
          );
          const averagePrice =
            totalActivities > 0 ? (totalPrice / totalActivities).toFixed(2) : 0;
          const availableCount = filteredItems.filter(
            (item) => item.availability
          ).length;

          doc.autoTable({
            startY: 40,
            head: [
              [
                "Name",
                "Category",
                "Location",
                "Duration",
                "Price",
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
              0: { cellWidth: 50, halign: "left" },
              1: { cellWidth: 25, halign: "center" },
              2: { cellWidth: 30, halign: "left" },
              3: { cellWidth: 25, halign: "center" },
              4: { cellWidth: 20, halign: "right" },
              5: { cellWidth: 30, halign: "center" },
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
          doc.text(`Total Activities: ${totalActivities}`, 10, finalY + 10);
          doc.text(`Available Activities: ${availableCount}`, 10, finalY + 15);
          doc.text(`Average Price: $${averagePrice}`, 10, finalY + 20);
          doc.text(
            `Total Revenue Potential: $${totalPrice.toFixed(2)}`,
            10,
            finalY + 25
          );

          doc.save(`Activity_Report_${reportDate.replace(/, /g, "_")}.pdf`);
        };
      })
      .catch((error) => {
        console.error("Failed to load jsPDF or autoTable", error);
        alert("Failed to generate report. Please try again.");
      });
  };

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.duration || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
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
        Loading activities...
      </div>
    );
  }

  if (error) {
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
          onClick={load}
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
      <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
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
            Activity Management
          </h2>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              style={{
                background: "linear-gradient(135deg, #007bff, #0056b3)",
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
            >
              <FaPlus /> Add Activity
            </button>
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
              disabled={filteredItems.length === 0}
            >
              <FaFileDownload /> Generate Report
            </button>
          </div>
        </div>
        <div style={{ position: "relative", marginBottom: "24px" }}>
          <input
            type="text"
            placeholder="Search activities..."
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
        {filteredItems.length === 0 ? (
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
              No Activities Found
            </h3>
            <p style={{ color: "#666", fontSize: "14px" }}>
              Add a new activity or adjust your search.
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
                    "Image",
                    "Name",
                    "Category",
                    "Location",
                    "Duration",
                    "Price",
                    "Availability",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      style={{
                        padding: "16px",
                        textAlign: "left",
                        borderBottom: "2px solid #4a7c59",
                        color: "#2d5a27",
                        fontWeight: "600",
                        fontSize: "14px",
                        minWidth:
                          header === "Actions"
                            ? "150px"
                            : header === "Image"
                            ? "80px"
                            : "100px",
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr
                    key={item._id}
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
                    <td style={{ padding: "16px" }}>
                      {item.image ? (
                        <img
                          src={
                            item.image.startsWith("http")
                              ? item.image
                              : `${baseUrl}${item.image}`
                          }
                          alt={`${item.name} image`}
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "4px",
                            border: "1px solid #e8f5e8",
                          }}
                          onError={(e) =>
                            (e.target.src = "/placeholder-image.jpg")
                          }
                        />
                      ) : (
                        <div
                          style={{
                            width: "60px",
                            height: "60px",
                            backgroundColor: "e8f5e8",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            color: "#666",
                          }}
                        >
                          No Image
                        </div>
                      )}
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {item.name}
                    </td>
                    <td style={{ padding: "16px", fontSize: "14px" }}>
                      {item.category}
                    </td>
                    <td style={{ padding: "16px", fontSize: "14px" }}>
                      {item.location}
                    </td>
                    <td style={{ padding: "16px", fontSize: "14px" }}>
                      {item.duration || "-"}
                    </td>
                    <td style={{ padding: "16px", fontSize: "14px" }}>
                      ${item.price.toFixed(2)}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span
                        style={{
                          padding: "6px 16px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600",
                          backgroundColor: item.availability
                            ? "#d4edda"
                            : "#f8d7da",
                          color: item.availability ? "#2d5a27" : "#721c24",
                          border: item.availability
                            ? "1px solid #4a7c59"
                            : "1px solid #dc3545",
                        }}
                      >
                        {item.availability ? "Available" : "Unavailable"}
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
                      <button
                        onClick={() => edit(item)}
                        style={{
                          backgroundColor: "#ffc107",
                          color: "#212529",
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
                        title="Edit"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => del(item._id, item.name)}
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
        {showForm && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "20px",
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "24px",
                width: "100%",
                maxWidth: "600px",
                maxHeight: "90vh",
                overflow: "auto",
                boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <h2
                  style={{
                    color: "#2d5a27",
                    margin: 0,
                    fontSize: "20px",
                    fontWeight: "600",
                  }}
                >
                  {editingId ? "Edit Activity" : "Add New Activity"}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    resetForm();
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#6c757d",
                    fontSize: "18px",
                    transition: "color 0.2s ease",
                  }}
                >
                  <FaTimes />
                </button>
              </div>
              <form onSubmit={submit}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        fontWeight: "600",
                        color: "#2d5a27",
                        fontSize: "14px",
                      }}
                    >
                      Activity Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Udawalawe Safari"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: `1px solid ${
                          formErrors.name ? "#dc3545" : "#e8f5e8"
                        }`,
                        borderRadius: "6px",
                        fontSize: "14px",
                        backgroundColor: "white",
                        transition:
                          "border-color 0.2s ease, box-shadow 0.2s ease",
                        boxShadow: `0 1px 3px rgba(0,0,0,0.05) ${
                          formErrors.name
                            ? ", 0 0 0 2px rgba(220,53,69,0.2)"
                            : ""
                        }`,
                      }}
                    />
                    {formErrors.name && (
                      <p
                        style={{
                          color: "#dc3545",
                          fontSize: "12px",
                          marginTop: "4px",
                        }}
                      >
                        {formErrors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        fontWeight: "600",
                        color: "#2d5a27",
                        fontSize: "14px",
                      }}
                    >
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      required
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #e8f5e8",
                        borderRadius: "6px",
                        fontSize: "14px",
                        backgroundColor: "white",
                        transition:
                          "border-color 0.2s ease, box-shadow 0.2s ease",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                      }}
                    >
                      {[
                        "Wildlife",
                        "Water Sports",
                        "Heritage",
                        "Adventure",
                        "Other",
                      ].map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        fontWeight: "600",
                        color: "#2d5a27",
                        fontSize: "14px",
                      }}
                    >
                      Location *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Udawalawe"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      required
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: `1px solid ${
                          formErrors.location ? "#dc3545" : "#e8f5e8"
                        }`,
                        borderRadius: "6px",
                        fontSize: "14px",
                        backgroundColor: "white",
                        transition:
                          "border-color 0.2s ease, box-shadow 0.2s ease",
                        boxShadow: `0 1px 3px rgba(0,0,0,0.05) ${
                          formErrors.location
                            ? ", 0 0 0 2px rgba(220,53,69,0.2)"
                            : ""
                        }`,
                      }}
                    />
                    {formErrors.location && (
                      <p
                        style={{
                          color: "#dc3545",
                          fontSize: "12px",
                          marginTop: "4px",
                        }}
                      >
                        {formErrors.location}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        fontWeight: "600",
                        color: "#2d5a27",
                        fontSize: "14px",
                      }}
                    >
                      Image {editingId ? "(Optional)" : "*"}
                    </label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleImageChange}
                      style={{
                        width: "100%",
                        padding: "10px 0",
                        fontSize: "14px",
                      }}
                    />
                    {formErrors.image && (
                      <p
                        style={{
                          color: "#dc3545",
                          fontSize: "12px",
                          marginTop: "4px",
                        }}
                      >
                        {formErrors.image}
                      </p>
                    )}
                    {imagePreview && (
                      <div style={{ marginTop: "8px" }}>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "4px",
                            border: "1px solid #e8f5e8",
                          }}
                        />
                        {editingId && imagePreview.startsWith(baseUrl) && (
                          <p
                            style={{
                              fontSize: "12px",
                              color: "#666",
                              marginTop: "4px",
                            }}
                          >
                            Current image (select a new file to replace)
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        fontWeight: "600",
                        color: "#2d5a27",
                        fontSize: "14px",
                      }}
                    >
                      Duration
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Half-day"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: `1px solid ${
                          formErrors.duration ? "#dc3545" : "#e8f5e8"
                        }`,
                        borderRadius: "6px",
                        fontSize: "14px",
                        backgroundColor: "white",
                        transition:
                          "border-color 0.2s ease, box-shadow 0.2s ease",
                        boxShadow: `0 1px 3px rgba(0,0,0,0.05) ${
                          formErrors.duration
                            ? ", 0 0 0 2px rgba(220,53,69,0.2)"
                            : ""
                        }`,
                      }}
                    />
                    {formErrors.duration && (
                      <p
                        style={{
                          color: "#dc3545",
                          fontSize: "12px",
                          marginTop: "4px",
                        }}
                      >
                        {formErrors.duration}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        fontWeight: "600",
                        color: "#2d5a27",
                        fontSize: "14px",
                      }}
                    >
                      Price per Person (USD)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g., 40"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: Number(e.target.value),
                        })
                      }
                      step="0.01"
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: `1px solid ${
                          formErrors.price ? "#dc3545" : "#e8f5e8"
                        }`,
                        borderRadius: "6px",
                        fontSize: "14px",
                        backgroundColor: "white",
                        transition:
                          "border-color 0.2s ease, box-shadow 0.2s ease",
                        boxShadow: `0 1px 3px rgba(0,0,0,0.05) ${
                          formErrors.price
                            ? ", 0 0 0 2px rgba(220,53,69,0.2)"
                            : ""
                        }`,
                      }}
                    />
                    {formErrors.price && (
                      <p
                        style={{
                          color: "#dc3545",
                          fontSize: "12px",
                          marginTop: "4px",
                        }}
                      >
                        {formErrors.price}
                      </p>
                    )}
                    <small style={{ color: "#6c757d", fontSize: "12px" }}>
                      Specify cost per participant.
                    </small>
                  </div>
                  <div>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontWeight: "600",
                        color: "#2d5a27",
                        fontSize: "14px",
                        marginBottom: "6px",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.availability}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            availability: e.target.checked,
                          })
                        }
                      />
                      Available
                    </label>
                  </div>
                </div>
                <div
                  style={{ display: "flex", gap: "12px", marginTop: "20px" }}
                >
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "linear-gradient(135deg, #007bff, #0056b3)",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    {editingId ? "Update Activity" : "Create Activity"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      resetForm();
                    }}
                    style={{
                      flex: 1,
                      padding: "12px",
                      backgroundColor: "#6c757d",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <style>
        {`
          @media (max-width: 768px) {
            form { grid-template-columns: 1fr; }
            table { font-size: 12px; }
            th, td { padding: 8px; min-width: 80px; }
            button { padding: 6px 8px; font-size: 11px; }
            input, select { font-size: 12px; }
          }
          button:hover:not(:disabled) { filter: brightness(1.1); }
          button:disabled { opacity: 0.6; }
          tr:hover { background-color: #f8f9fa !important; }
        `}
      </style>
    </div>
  );
};

export default AdminActivities;
