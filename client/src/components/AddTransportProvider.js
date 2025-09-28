import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import AdminNavbar from "./admin/AdminNavbar";

const AddTransportProvider = () => {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    vehicleType: "",
    vehicleBrand: "",
    vehicleModel: "",
    seats: 4,
    price: 0,
    currency: "LKR",
    priceUnit: "per day",
    availability: true,
    description: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({
    name: "",
    contact: "",
    email: "",
    vehicleType: "",
    seats: "",
    price: "",
  });

  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    const nameRegex = /^[A-Za-z\s]{2,100}$/;
    const contactRegex = /^[0-9+\-\s]{10,15}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const priceRegex = /^\d+(\.\d{1,2})?$/;
    const seatsRegex = /^[1-9][0-9]?$/;

    if (!nameRegex.test(formData.name)) {
      errors.name = "Name must be 2-100 characters, letters and spaces only";
    }
    if (!contactRegex.test(formData.contact)) {
      errors.contact =
        "Contact must be a valid phone number (10-15 digits, +, -, or spaces)";
    }
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.vehicleType) {
      errors.vehicleType = "Vehicle type is required";
    }
    if (
      !seatsRegex.test(formData.seats.toString()) ||
      formData.seats < 1 ||
      formData.seats > 50
    ) {
      errors.seats = "Seats must be a number between 1 and 50";
    }
    if (!priceRegex.test(formData.price.toString()) || formData.price < 0) {
      errors.price =
        "Price must be a non-negative number with up to 2 decimal places";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageFiles.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }

    setImageFiles((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview((prev) => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      imageFiles.forEach((file) => {
        formDataToSend.append("images", file);
      });

      await axios.post(
        "http://localhost:5000/api/transport-providers",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Transport provider added successfully!");
      navigate("/admin");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to add transport provider. Please try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
            Add New Transport Provider
          </h2>
          <Link
            to="/admin"
            style={{
              color: "#6c757d",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            ← Back to Transport Providers
          </Link>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "#f8d7da",
              color: "#721c24",
              padding: "10px",
              borderRadius: "4px",
              marginBottom: "20px",
              border: "1px solid #f5c6cb",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: "white",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            border: "1px solid #e8f5e8",
          }}
        >
          <div
            style={{
              marginBottom: "24px",
              border: "1px solid #e8f5e8",
              borderRadius: "10px",
              padding: "20px",
              background: "#fbfffb",
            }}
          >
            <h3
              style={{
                marginTop: 0,
                color: "#2d5a27",
                fontSize: "18px",
                fontWeight: "600",
              }}
            >
              Personal Information
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "16px",
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
                  Owner Name *
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
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
                    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                    boxShadow: `0 1px 3px rgba(0,0,0,0.05) ${
                      formErrors.name ? ", 0 0 0 2px rgba(220,53,69,0.2)" : ""
                    }`,
                  }}
                  placeholder="Enter owner's name"
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
                  Contact Number *
                </label>
                <input
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1px solid ${
                      formErrors.contact ? "#dc3545" : "#e8f5e8"
                    }`,
                    borderRadius: "6px",
                    fontSize: "14px",
                    backgroundColor: "white",
                    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                    boxShadow: `0 1px 3px rgba(0,0,0,0.05) ${
                      formErrors.contact
                        ? ", 0 0 0 2px rgba(220,53,69,0.2)"
                        : ""
                    }`,
                  }}
                  placeholder="Enter contact number"
                />
                {formErrors.contact && (
                  <p
                    style={{
                      color: "#dc3545",
                      fontSize: "12px",
                      marginTop: "4px",
                    }}
                  >
                    {formErrors.contact}
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
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1px solid ${
                      formErrors.email ? "#dc3545" : "#e8f5e8"
                    }`,
                    borderRadius: "6px",
                    fontSize: "14px",
                    backgroundColor: "white",
                    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                    boxShadow: `0 1px 3px rgba(0,0,0,0.05) ${
                      formErrors.email ? ", 0 0 0 2px rgba(220,53,69,0.2)" : ""
                    }`,
                  }}
                  placeholder="Enter email (optional)"
                />
                {formErrors.email && (
                  <p
                    style={{
                      color: "#dc3545",
                      fontSize: "12px",
                      marginTop: "4px",
                    }}
                  >
                    {formErrors.email}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div
            style={{
              marginBottom: "24px",
              border: "1px solid #e8f5e8",
              borderRadius: "10px",
              padding: "20px",
              background: "#fbfffb",
            }}
          >
            <h3
              style={{
                marginTop: 0,
                color: "#2d5a27",
                fontSize: "18px",
                fontWeight: "600",
              }}
            >
              Vehicle Information
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "16px",
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
                  Vehicle Type *
                </label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1px solid ${
                      formErrors.vehicleType ? "#dc3545" : "#e8f5e8"
                    }`,
                    borderRadius: "6px",
                    fontSize: "14px",
                    backgroundColor: "white",
                    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                    boxShadow: `0 1px 3px rgba(0,0,0,0.05) ${
                      formErrors.vehicleType
                        ? ", 0 0 0 2px rgba(220,53,69,0.2)"
                        : ""
                    }`,
                  }}
                >
                  <option value="">Select vehicle type</option>
                  {[
                    "Car",
                    "Van",
                    "Bus",
                    "Motorcycle",
                    "Bicycle",
                    "Tuk-tuk",
                    "Other",
                  ].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {formErrors.vehicleType && (
                  <p
                    style={{
                      color: "#dc3545",
                      fontSize: "12px",
                      marginTop: "4px",
                    }}
                  >
                    {formErrors.vehicleType}
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
                  Vehicle Brand
                </label>
                <input
                  name="vehicleBrand"
                  value={formData.vehicleBrand}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #e8f5e8",
                    borderRadius: "6px",
                    fontSize: "14px",
                    backgroundColor: "white",
                    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                  placeholder="e.g., Toyota"
                />
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
                  Vehicle Model
                </label>
                <input
                  name="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #e8f5e8",
                    borderRadius: "6px",
                    fontSize: "14px",
                    backgroundColor: "white",
                    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                  placeholder="e.g., Prius"
                />
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginTop: "16px",
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
                  Number of Seats *
                </label>
                <input
                  type="number"
                  name="seats"
                  value={formData.seats}
                  onChange={handleChange}
                  required
                  min="1"
                  max="50"
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1px solid ${
                      formErrors.seats ? "#dc3545" : "#e8f5e8"
                    }`,
                    borderRadius: "6px",
                    fontSize: "14px",
                    backgroundColor: "white",
                    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                    boxShadow: `0 1px 3px rgba(0,0,0,0.05) ${
                      formErrors.seats ? ", 0 0 0 2px rgba(220,53,69,0.2)" : ""
                    }`,
                  }}
                />
                {formErrors.seats && (
                  <p
                    style={{
                      color: "#dc3545",
                      fontSize: "12px",
                      marginTop: "4px",
                    }}
                  >
                    {formErrors.seats}
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
                  Description
                </label>
                <input
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #e8f5e8",
                    borderRadius: "6px",
                    fontSize: "14px",
                    backgroundColor: "white",
                    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                  placeholder="Optional notes about the vehicle"
                />
              </div>
            </div>
          </div>

          <div
            style={{
              marginBottom: "24px",
              border: "1px solid #e8f5e8",
              borderRadius: "10px",
              padding: "20px",
              background: "#fbfffb",
            }}
          >
            <h3
              style={{
                marginTop: 0,
                color: "#2d5a27",
                fontSize: "18px",
                fontWeight: "600",
              }}
            >
              Charges & Fees
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "16px",
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
                  Currency *
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #e8f5e8",
                    borderRadius: "6px",
                    fontSize: "14px",
                    backgroundColor: "white",
                    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                >
                  {[
                    { value: "LKR", label: "Sri Lankan Rupee (LKR)" },
                    { value: "USD", label: "US Dollar (USD)" },
                    { value: "EUR", label: "Euro (EUR)" },
                    { value: "GBP", label: "British Pound (GBP)" },
                    { value: "AUD", label: "Australian Dollar (AUD)" },
                    { value: "CAD", label: "Canadian Dollar (CAD)" },
                    { value: "JPY", label: "Japanese Yen (JPY)" },
                    { value: "INR", label: "Indian Rupee (INR)" },
                  ].map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
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
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
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
                    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                    boxShadow: `0 1px 3px rgba(0,0,0,0.05) ${
                      formErrors.price ? ", 0 0 0 2px rgba(220,53,69,0.2)" : ""
                    }`,
                  }}
                  placeholder="Enter price"
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
                  Price Unit
                </label>
                <select
                  name="priceUnit"
                  value={formData.priceUnit}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #e8f5e8",
                    borderRadius: "6px",
                    fontSize: "14px",
                    backgroundColor: "white",
                    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                >
                  {["Per Day", "Per Kilometer", "Per Trip", "Per Hour"].map(
                    (unit) => (
                      <option key={unit} value={unit.toLowerCase()}>
                        {unit}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#2d5a27",
                fontSize: "14px",
              }}
            >
              Vehicle Images (Max 5)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              style={{
                width: "100%",
                padding: "10px",
                border: "2px dashed #4a7c59",
                borderRadius: "8px",
                fontSize: "14px",
                backgroundColor: "#f8fff8",
                cursor: "pointer",
              }}
            />
            <p style={{ fontSize: "12px", color: "#666", margin: "5px 0 0 0" }}>
              Upload high-quality images of your vehicle (JPG, PNG, WebP)
            </p>
            {imagePreview.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                  gap: "10px",
                  marginTop: "15px",
                }}
              >
                {imagePreview.map((preview, index) => (
                  <div key={index} style={{ position: "relative" }}>
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "6px",
                        border: "2px solid #e8f5e8",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-8px",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "24px",
                        height: "24px",
                        fontSize: "12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginBottom: "30px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontWeight: "600",
                color: "#2d5a27",
                fontSize: "14px",
              }}
            >
              <input
                type="checkbox"
                name="availability"
                checked={formData.availability}
                onChange={handleChange}
                style={{ transform: "scale(1.2)" }}
              />
              Currently Available
            </label>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: "12px",
                background: loading
                  ? "#6c757d"
                  : "linear-gradient(135deg, #007bff, #0056b3)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {loading ? "Adding..." : "Add Provider"}
            </button>
            <Link
              to="/admin"
              style={{
                flex: 1,
                padding: "12px",
                backgroundColor: "#6c757d",
                color: "white",
                textDecoration: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                textAlign: "center",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransportProvider;
