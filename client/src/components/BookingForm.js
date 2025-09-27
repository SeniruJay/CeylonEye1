import React, { useState } from "react";
import axios from "axios";

const BookingForm = ({ provider, onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    pickupLocation: "",
    dropoffLocation: "",
    bookingDate: "",
    bookingTime: "",
    numberOfPassengers: 1,
    specialRequests: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const bookingData = {
        providerId: provider._id,
        ...form,
        numberOfPassengers: parseInt(form.numberOfPassengers)
      };

      const response = await axios.post("http://localhost:5000/api/bookings", bookingData);
      
      // Show success message with PDF download
      const downloadPDF = () => {
        window.open(`http://localhost:5000/api/bookings/${response.data._id}/pdf`, '_blank');
      };

      const currency = provider.currency || 'USD';
      const symbol = getCurrencySymbol(currency);
      const successMessage = `Your transport has been booked successfully!\n\nBooking ID: ${response.data.bookingId}\nTotal Price: ${symbol}${response.data.totalPrice}\n\nClick OK to download your confirmation document.`;
      
      if (window.confirm(successMessage)) {
        downloadPDF();
      }
      
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create booking. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getVehicleIcon = (vehicleType) => {
    const icons = {
      'Car': '🚗',
      'Van': '🚐',
      'Bus': '🚌',
      'Motorcycle': '🏍️',
      'Bicycle': '🚲',
      'Tuk-tuk': '🛺',
      'Other': '🚙'
    };
    return icons[vehicleType] || '🚙';
  };

  const getCurrencySymbol = (currency) => {
    const symbols = {
      'LKR': 'Rs.',
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'AUD': 'A$',
      'CAD': 'C$',
      'JPY': '¥',
      'INR': '₹'
    };
    return symbols[currency] || currency;
  };

  const calculateTotalPrice = () => {
    const basePrice = provider.price;
    const passengers = parseInt(form.numberOfPassengers);
    // Backend currently computes total as price * numberOfPassengers
    return (basePrice * passengers).toFixed(2);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ marginBottom: "20px" }}>
        <button 
          onClick={onCancel}
          style={{
            color: "#4a7c59",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "500",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "8px 0"
          }}
        >
          ← Back to Transport Options
        </button>
      </div>

      <div style={{ 
        backgroundColor: "white", 
        borderRadius: "12px", 
        padding: "30px",
        boxShadow: "0 4px 12px rgba(74, 124, 89, 0.15)",
        border: "1px solid #e8f5e8"
      }}>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          marginBottom: "30px",
          paddingBottom: "20px",
          borderBottom: "2px solid #f0f7f0"
        }}>
          <div style={{ 
            fontSize: "3rem", 
            marginRight: "20px",
            backgroundColor: "#f0f7f0",
            padding: "15px",
            borderRadius: "50%",
            width: "80px",
            height: "80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            {getVehicleIcon(provider.vehicleType)}
          </div>
          <div>
            <h2 style={{ margin: "0", color: "#2d5a27", fontSize: "1.8rem" }}>
              Book {provider.name}
            </h2>
            <p style={{ margin: "5px 0 0 0", color: "#4a7c59", fontSize: "1.1rem" }}>
              {provider.vehicleType} • {provider.seats} seats • {getCurrencySymbol(provider.currency || 'USD')}{provider.price} {provider.priceUnit}
            </p>
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "12px",
            borderRadius: "6px",
            marginBottom: "20px",
            border: "1px solid #f5c6cb"
          }}>
            {error}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2d5a27" }}>
                Full Name *
              </label>
              <input 
                name="customerName" 
                value={form.customerName} 
                onChange={handleChange} 
                required 
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e8f5e8",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                  transition: "border-color 0.3s ease",
                  outline: "none"
                }}
                onFocus={(e) => e.target.style.borderColor = "#4a7c59"}
                onBlur={(e) => e.target.style.borderColor = "#e8f5e8"}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2d5a27" }}>
                Email Address *
              </label>
              <input 
                type="email"
                name="customerEmail" 
                value={form.customerEmail} 
                onChange={handleChange} 
                required 
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e8f5e8",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                  transition: "border-color 0.3s ease",
                  outline: "none"
                }}
                onFocus={(e) => e.target.style.borderColor = "#4a7c59"}
                onBlur={(e) => e.target.style.borderColor = "#e8f5e8"}
                placeholder="Enter your email"
              />
            </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2d5a27" }}>
                Phone Number *
              </label>
              <input 
                type="tel"
                name="customerPhone" 
                value={form.customerPhone} 
                onChange={handleChange} 
                required 
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e8f5e8",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                  transition: "border-color 0.3s ease",
                  outline: "none"
                }}
                onFocus={(e) => e.target.style.borderColor = "#4a7c59"}
                onBlur={(e) => e.target.style.borderColor = "#e8f5e8"}
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2d5a27" }}>
                Number of Passengers *
              </label>
              <select 
                name="numberOfPassengers" 
                value={form.numberOfPassengers} 
                onChange={handleChange} 
                required 
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e8f5e8",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                  backgroundColor: "white",
                  transition: "border-color 0.3s ease",
                  outline: "none"
                }}
                onFocus={(e) => e.target.style.borderColor = "#4a7c59"}
                onBlur={(e) => e.target.style.borderColor = "#e8f5e8"}
              >
                {Array.from({ length: provider.seats }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'passenger' : 'passengers'}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2d5a27" }}>
                Pickup Location *
              </label>
              <input 
                name="pickupLocation" 
                value={form.pickupLocation} 
                onChange={handleChange} 
                required 
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e8f5e8",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                  transition: "border-color 0.3s ease",
                  outline: "none"
                }}
                onFocus={(e) => e.target.style.borderColor = "#4a7c59"}
                onBlur={(e) => e.target.style.borderColor = "#e8f5e8"}
                placeholder="Enter pickup location"
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2d5a27" }}>
                Drop-off Location *
              </label>
              <input 
                name="dropoffLocation" 
                value={form.dropoffLocation} 
                onChange={handleChange} 
                required 
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e8f5e8",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                  transition: "border-color 0.3s ease",
                  outline: "none"
                }}
                onFocus={(e) => e.target.style.borderColor = "#4a7c59"}
                onBlur={(e) => e.target.style.borderColor = "#e8f5e8"}
                placeholder="Enter drop-off location"
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2d5a27" }}>
                Date *
              </label>
              <input 
                type="date"
                name="bookingDate" 
                value={form.bookingDate} 
                onChange={handleChange} 
                required 
                min={new Date().toISOString().split('T')[0]}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e8f5e8",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                  transition: "border-color 0.3s ease",
                  outline: "none"
                }}
                onFocus={(e) => e.target.style.borderColor = "#4a7c59"}
                onBlur={(e) => e.target.style.borderColor = "#e8f5e8"}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2d5a27" }}>
                Time *
              </label>
              <input 
                type="time"
                name="bookingTime" 
                value={form.bookingTime} 
                onChange={handleChange} 
                required 
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e8f5e8",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                  transition: "border-color 0.3s ease",
                  outline: "none"
                }}
                onFocus={(e) => e.target.style.borderColor = "#4a7c59"}
                onBlur={(e) => e.target.style.borderColor = "#e8f5e8"}
              />
            </div>
            </div>

            <div style={{ marginBottom: "30px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2d5a27" }}>
              Special Requests (Optional)
            </label>
            <textarea 
              name="specialRequests" 
              value={form.specialRequests} 
              onChange={handleChange} 
              rows="4"
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #e8f5e8",
                borderRadius: "8px",
                fontSize: "16px",
                boxSizing: "border-box",
                transition: "border-color 0.3s ease",
                outline: "none",
                resize: "vertical"
              }}
              onFocus={(e) => e.target.style.borderColor = "#4a7c59"}
              onBlur={(e) => e.target.style.borderColor = "#e8f5e8"}
              placeholder="Any special requests or requirements..."
            />
            </div>

            <div style={{ 
              display: "flex", 
              gap: "15px",
              paddingTop: "20px",
              borderTop: "2px solid #f0f7f0"
            }}>
              <button 
                type="submit" 
                disabled={loading}
                style={{
                  flex: "1",
                  padding: "15px",
                  backgroundColor: loading ? "#6c757d" : "#4a7c59",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: "0 2px 4px rgba(74, 124, 89, 0.3)",
                  transition: "all 0.3s ease"
                }}
                onMouseOver={(e) => {
                  if (!loading) {
                    e.target.style.backgroundColor = "#3d6b4a";
                    e.target.style.transform = "translateY(-2px)";
                  }
                }}
                onMouseOut={(e) => {
                  if (!loading) {
                    e.target.style.backgroundColor = "#4a7c59";
                    e.target.style.transform = "translateY(0)";
                  }
                }}
              >
                {loading ? "Processing..." : "Confirm Booking"}
              </button>
              
              <button 
                type="button"
                onClick={onCancel}
                style={{
                  flex: "1",
                  padding: "15px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(108, 117, 125, 0.3)",
                  transition: "all 0.3s ease"
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#5a6268";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#6c757d";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Booking Summary */}
          <aside style={{
            border: "1px solid #e8f5e8",
            borderRadius: "12px",
            padding: "16px",
            backgroundColor: "#f8fff8",
            height: "fit-content"
          }}>
            <h3 style={{ marginTop: 0, color: "#2d5a27" }}>Booking Summary</h3>
            <div style={{ display: "grid", rowGap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Provider</span>
                <strong style={{ color: "#2d5a27" }}>{provider.name}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Vehicle</span>
                <strong style={{ color: "#2d5a27" }}>{provider.vehicleType} • {provider.seats} seats</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Pickup</span>
                <strong style={{ color: "#2d5a27" }}>{form.pickupLocation || '-'}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Drop-off</span>
                <strong style={{ color: "#2d5a27" }}>{form.dropoffLocation || '-'}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Date & Time</span>
                <strong style={{ color: "#2d5a27" }}>{form.bookingDate || '-'} {form.bookingTime || ''}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px dashed #cfe3cf", paddingTop: 8 }}>
                <span style={{ color: "#666" }}>Passengers</span>
                <strong style={{ color: "#2d5a27" }}>{form.numberOfPassengers}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Rate</span>
                <strong style={{ color: "#2d5a27" }}>{getCurrencySymbol(provider.currency || 'USD')}{provider.price} {provider.priceUnit}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "2px solid #e8f5e8", paddingTop: 8 }}>
                <span style={{ color: "#2d5a27", fontWeight: 700 }}>Estimated Total</span>
                <span style={{ color: "#2d5a27", fontWeight: 800, fontSize: "1.1rem" }}>
                  {getCurrencySymbol(provider.currency || 'USD')}{calculateTotalPrice()}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
