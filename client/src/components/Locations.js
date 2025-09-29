import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const Locations = () => {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [type, setType] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(null); // store selected card for booking modal
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation functions
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const validateDate = (date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    return selectedDate >= today;
  };

  const validateForm = (formData) => {
    const errors = {};
    
    // Validate phone number
    if (!formData.customerPhone) {
      errors.customerPhone = "Phone number is required";
    } else if (!validatePhoneNumber(formData.customerPhone)) {
      errors.customerPhone = "Phone number must be exactly 10 digits";
    }
    
    // Validate date
    if (!formData.visitDate) {
      errors.visitDate = "Visit date is required";
    } else if (!validateDate(formData.visitDate)) {
      errors.visitDate = "Visit date cannot be in the past";
    }
    
    // Validate name
    if (!formData.customerName || formData.customerName.trim().length < 2) {
      errors.customerName = "Full name must be at least 2 characters";
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.customerEmail) {
      errors.customerEmail = "Email is required";
    } else if (!emailRegex.test(formData.customerEmail)) {
      errors.customerEmail = "Please enter a valid email address";
    }
    
    // Validate group size
    if (!formData.groupSize || formData.groupSize < 1) {
      errors.groupSize = "Group size must be at least 1";
    } else if (formData.groupSize > 50) {
      errors.groupSize = "Group size cannot exceed 50 people";
    }
    
    return errors;
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("http://localhost:5000/api/locations");
        setItems(data);
        setError(null);
      } catch (e) {
        setError("Failed to load locations");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const regions = Array.from(new Set(items.map((l) => l.region)));
  const types = Array.from(new Set(items.map((l) => l.type)));

  const filtered = useMemo(() => {
    return items.filter((l) => {
      const s = search
        ? l.name.toLowerCase().includes(search.toLowerCase())
        : true;
      const r = region ? l.region === region : true;
      const t = type ? l.type === type : true;
      return s && r && t;
    });
  }, [items, search, region, type]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://holidayssrilanka.com/wp-content/uploads/2019/02/3-145.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        position: "relative",
      }}
    >
      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.55)",
          zIndex: 0,
        }}
      />

      <style>
        {`
          html, body, #root {
            overflow-x: hidden !important;
            width: 100vw !important;
            position: relative;
          }
          body {
            overscroll-behavior-x: none;
          }
          .card-hover { transition: 0.3s; }
          .card-hover:hover { transform: translateY(-6px); box-shadow: 0 12px 28px rgba(0,0,0,0.25); }

          /* Modal animations */
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { transform: translateY(40px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .modal-backdrop {
            animation: fadeIn 0.3s ease forwards;
          }
          .modal-card {
            animation: slideUp 0.4s ease forwards;
          }
        `}
      </style>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px 20px",
          width: "100%",
          boxSizing: "border-box",
          overflowX: "hidden",
        }}
      >
        {/* Banner */}
        <div
          style={{
            borderRadius: "18px",
            padding: "50px 30px",
            marginBottom: "30px",
            color: "white",
            textAlign: "center",
            background:
              "linear-gradient(135deg, rgba(81, 81, 81, 0.65), rgba(135, 67, 2, 0.59)), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?fm=jpg&q=60&w=2000') center/cover no-repeat",
            boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "2.6rem", fontWeight: 800 }}>
            🌍 Explore Locations
          </h1>
          <p style={{ marginTop: 10, fontSize: "1.2rem", opacity: 0.95 }}>
            Discover Sri Lanka’s most iconic destinations
          </p>
        </div>

        {/* Filters */}
        <div
          style={{
            background: "rgba(255,255,255,0.97)",
            borderRadius: 16,
            padding: 20,
            marginBottom: 30,
            boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
          }}
        >
          <h3 style={{ margin: "0 0 12px 0", color: "#2d6a4f" }}>
            🔎 Refine your search
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 15,
            }}
          >
            <input
              placeholder="Search location"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: 12,
                borderRadius: 8,
                border: "2px solid #e8f5e8",
                outline: "none",
              }}
            />
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              style={{
                padding: 12,
                borderRadius: 8,
                border: "2px solid #e8f5e8",
                background: "#fff",
              }}
            >
              <option value="">Any region</option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{
                padding: 12,
                borderRadius: 8,
                border: "2px solid #e8f5e8",
                background: "#fff",
              }}
            >
              <option value="">Any type</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 30, color: "white" }}>
            Loading...
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: 30, color: "red" }}>
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: 30,
              background: "white",
              border: "2px dashed #4a7c59",
              borderRadius: 12,
            }}
          >
            No results. Try different filters.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {filtered.map((l) => (
              <div
                key={l._id}
                className="card-hover"
                style={{
                  background: "white",
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "1px solid #e8f5e8",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                }}
              >
                <img
  src={
    l.image
      ? `http://localhost:5000${l.image}` // ✅ prepend API server
      : "https://images.unsplash.com/photo-1601918774946-2588f4c36de7?fm=jpg&q=80&w=1000"
  }
  alt={l.name}
  style={{ width: "100%", height: 160, objectFit: "cover" }}
/>

                <div style={{ padding: 16 }}>
                  <div
                    style={{
                      fontSize: 20,
                      color: "#2d6a4f",
                      fontWeight: 700,
                    }}
                  >
                    {l.name}
                  </div>
                  <div style={{ color: "#4a7c59", marginTop: 6 }}>
                    {l.region} • {l.type}
                  </div>
                  <button
                    onClick={() => setBooking(l)}
                    style={{
                      marginTop: 12,
                      width: "100%",
                      padding: "10px 16px",
                      borderRadius: 8,
                      border: "none",
                      background: "#2d6a4f",
                      color: "#fff",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Book Visit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Booking Modal */}
        {booking && (
          <div
            className="modal-backdrop"
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(3px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
              zIndex: 999,
            }}
          >
            <div
              className="modal-card"
              style={{
                background: "white",
                borderRadius: 16,
                padding: 24,
                width: "100%",
                maxWidth: 520,
                boxShadow: "0 8px 28px rgba(0,0,0,0.25)",
              }}
            >
              <h3 style={{ marginTop: 0, color: "#2d6a4f" }}>
                Book {booking.name}
              </h3>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsSubmitting(true);
                  setValidationErrors({});

                  const fd = new FormData(e.currentTarget);
                  const payload = Object.fromEntries(fd.entries());

                  // Validate form data
                  const errors = validateForm(payload);
                  if (Object.keys(errors).length > 0) {
                    setValidationErrors(errors);
                    setIsSubmitting(false);
                    return;
                  }

                  try {
                    await axios.post(
                      "http://localhost:5000/api/bookings-extra/location",
                      {
                        locationId: booking._id,
                        customerName: payload.customerName,
                        customerEmail: payload.customerEmail,
                        customerPhone: payload.customerPhone,
                        visitDate: payload.visitDate,
                        groupSize: Number(payload.groupSize),
                        specialRequests: payload.specialRequests || "",
                      }
                    );
                    alert("Booking created successfully!");
                    setBooking(null);
                    setValidationErrors({});
                  } catch (error) {
                    console.error("Booking error:", error);
                    let message = "Booking failed. Please try again.";
                    if (error.response && error.response.data && error.response.data.message) {
                      message = error.response.data.message;
                    } else if (error.response && typeof error.response.data === 'string') {
                      message = error.response.data;
                    }
                    alert(message);
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                  }}
                >
                  <div>
                    <input
                      name="customerName"
                      placeholder="Full name"
                      required
                      style={{
                        padding: 10,
                        borderRadius: 8,
                        border: validationErrors.customerName ? "2px solid #dc3545" : "2px solid #e8f5e8",
                        width: "100%",
                        boxSizing: "border-box"
                      }}
                    />
                    {validationErrors.customerName && (
                      <div style={{ color: "#dc3545", fontSize: "0.8rem", marginTop: "4px" }}>
                        {validationErrors.customerName}
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="email"
                      name="customerEmail"
                      placeholder="Email"
                      required
                      style={{
                        padding: 10,
                        borderRadius: 8,
                        border: validationErrors.customerEmail ? "2px solid #dc3545" : "2px solid #e8f5e8",
                        width: "100%",
                        boxSizing: "border-box"
                      }}
                    />
                    {validationErrors.customerEmail && (
                      <div style={{ color: "#dc3545", fontSize: "0.8rem", marginTop: "4px" }}>
                        {validationErrors.customerEmail}
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      name="customerPhone"
                      placeholder="Phone (10 digits)"
                      required
                      maxLength="10"
                      pattern="[0-9]{10}"
                      style={{
                        padding: 10,
                        borderRadius: 8,
                        border: validationErrors.customerPhone ? "2px solid #dc3545" : "2px solid #e8f5e8",
                        width: "100%",
                        boxSizing: "border-box"
                      }}
                    />
                    {validationErrors.customerPhone && (
                      <div style={{ color: "#dc3545", fontSize: "0.8rem", marginTop: "4px" }}>
                        {validationErrors.customerPhone}
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="date"
                      name="visitDate"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      style={{
                        padding: 10,
                        borderRadius: 8,
                        border: validationErrors.visitDate ? "2px solid #dc3545" : "2px solid #e8f5e8",
                        width: "100%",
                        boxSizing: "border-box"
                      }}
                    />
                    {validationErrors.visitDate && (
                      <div style={{ color: "#dc3545", fontSize: "0.8rem", marginTop: "4px" }}>
                        {validationErrors.visitDate}
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="number"
                      name="groupSize"
                      min="1"
                      max="50"
                      defaultValue="1"
                      required
                      style={{
                        padding: 10,
                        borderRadius: 8,
                        border: validationErrors.groupSize ? "2px solid #dc3545" : "2px solid #e8f5e8",
                        width: "100%",
                        boxSizing: "border-box"
                      }}
                    />
                    {validationErrors.groupSize && (
                      <div style={{ color: "#dc3545", fontSize: "0.8rem", marginTop: "4px" }}>
                        {validationErrors.groupSize}
                      </div>
                    )}
                  </div>
                </div>
                <textarea
                  name="specialRequests"
                  placeholder="Special requests"
                  rows={3}
                  style={{
                    marginTop: 10,
                    width: "100%",
                    padding: 10,
                    borderRadius: 8,
                    border: "2px solid #e8f5e8",
                  }}
                />
                <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      flex: 1,
                      padding: "10px 16px",
                      background: isSubmitting ? "#6c757d" : "#2d6a4f",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      fontWeight: 700,
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                      opacity: isSubmitting ? 0.7 : 1,
                    }}
                  >
                    {isSubmitting ? "Processing..." : "Confirm"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBooking(null);
                      setValidationErrors({});
                      setIsSubmitting(false);
                    }}
                    style={{
                      flex: 1,
                      padding: "10px 16px",
                      background: "#6c757d",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      fontWeight: 700,
                      cursor: "pointer",
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
    </div>
  );
};

export default Locations;
