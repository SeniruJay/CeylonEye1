import React, { useState } from "react";

const PaymentStep = ({ onBack, onSubmit, bookingData, loading }) => {
  const [paymentData, setPaymentData] = useState({
    name: "",
    email: "",
    phone: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    billingAddress: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!paymentData.name || !paymentData.email || !paymentData.phone || 
        !paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || 
        !paymentData.billingAddress) {
      alert("Please fill in all payment details.");
      return;
    }
    onSubmit(paymentData);
  };

  const calculateTotal = () => {
    let total = 0;
    
    // Transport cost (assuming per day for simplicity)
    if (bookingData.transport) {
      total += bookingData.transport.price * 3; // 3 days example
    }
    
    // Accommodation cost (per night)
    if (bookingData.accommodations && bookingData.accommodations.length > 0) {
      total += bookingData.accommodations.reduce((sum, acc) => sum + acc.price, 0) * 3; // 3 nights
    }
    
    // Activity costs
    if (bookingData.activities && bookingData.activities.length > 0) {
      total += bookingData.activities.reduce((sum, act) => sum + act.price, 0);
    }
    
    return total;
  };

  const getCurrencySymbol = (currency = "USD") => {
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

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setPaymentData(prev => ({ ...prev, cardNumber: formatted }));
  };

  const total = calculateTotal();

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h2 style={{ color: "#2d5a27", fontSize: "2rem", marginBottom: "10px" }}>
          Payment Details
        </h2>
        <p style={{ color: "#4a7c59", fontSize: "1.1rem" }}>
          Complete your booking with secure payment
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
        {/* Payment Form */}
        <div>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2d5a27" }}>
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={paymentData.name}
                onChange={handleInputChange}
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

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2d5a27" }}>
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={paymentData.email}
                onChange={handleInputChange}
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

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2d5a27" }}>
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={paymentData.phone}
                onChange={handleInputChange}
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

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2d5a27" }}>
                Card Number *
              </label>
              <input
                type="text"
                name="cardNumber"
                value={paymentData.cardNumber}
                onChange={handleCardNumberChange}
                required
                maxLength="19"
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
                placeholder="1234 5678 9012 3456"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2d5a27" }}>
                  Expiry Date *
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={paymentData.expiryDate}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    const formatted = value.replace(/(\d{2})(\d{2})/, '$1/$2');
                    setPaymentData(prev => ({ ...prev, expiryDate: formatted }));
                  }}
                  required
                  maxLength="5"
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
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2d5a27" }}>
                  CVV *
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={paymentData.cvv}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setPaymentData(prev => ({ ...prev, cvv: value }));
                  }}
                  required
                  maxLength="4"
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
                  placeholder="123"
                />
              </div>
            </div>

            <div style={{ marginBottom: "30px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2d5a27" }}>
                Billing Address *
              </label>
              <textarea
                name="billingAddress"
                value={paymentData.billingAddress}
                onChange={handleInputChange}
                required
                rows="3"
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
                placeholder="Enter your billing address"
              />
            </div>

            <div style={{ 
              display: "flex", 
              gap: "15px",
              paddingTop: "20px",
              borderTop: "2px solid #f0f7f0"
            }}>
              <button
                type="button"
                onClick={onBack}
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
                ← Back to Activities
              </button>
              
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
                {loading ? "Processing..." : "Book Now"}
              </button>
            </div>
          </form>
        </div>

        {/* Booking Summary */}
        <div style={{
          border: "1px solid #e8f5e8",
          borderRadius: "12px",
          padding: "25px",
          backgroundColor: "#f8fff8",
          height: "fit-content"
        }}>
          <h3 style={{ marginTop: 0, color: "#2d5a27", fontSize: "1.3rem", marginBottom: "20px" }}>
            Booking Summary
          </h3>
          
          {/* Show skipped sections */}
          {((!bookingData.locations || bookingData.locations.length === 0) && 
           (!bookingData.transport) && 
           (!bookingData.accommodations || bookingData.accommodations.length === 0) && 
           (!bookingData.activities || bookingData.activities.length === 0)) && (
            <div style={{ 
              marginBottom: "20px", 
              padding: "15px", 
              backgroundColor: "#f8f9fa", 
              borderRadius: "8px",
              border: "1px solid #e9ecef"
            }}>
              <p style={{ 
                margin: 0, 
                color: "#6c757d", 
                fontSize: "0.9rem",
                fontStyle: "italic"
              }}>
                You've skipped all optional services. You can still complete your booking with just payment information.
              </p>
            </div>
          )}
          
          {/* Locations */}
          {bookingData.locations && bookingData.locations.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ color: "#4a7c59", fontSize: "1rem", marginBottom: "10px" }}>Destinations</h4>
              {bookingData.locations.map((location, index) => (
                <div key={index} style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  marginBottom: "5px",
                  fontSize: "0.9rem"
                }}>
                  <span style={{ color: "#666" }}>• {location.name}</span>
                  <span style={{ color: "#2d5a27", fontWeight: "600" }}>Free</span>
                </div>
              ))}
            </div>
          )}

          {/* Transport */}
          {bookingData.transport && (
            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ color: "#4a7c59", fontSize: "1rem", marginBottom: "10px" }}>Transport</h4>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                marginBottom: "5px",
                fontSize: "0.9rem"
              }}>
                <span style={{ color: "#666" }}>{bookingData.transport.name}</span>
                <span style={{ color: "#2d5a27", fontWeight: "600" }}>
                  {getCurrencySymbol()}{bookingData.transport.price * 3}
                </span>
              </div>
              <div style={{ 
                fontSize: "0.8rem", 
                color: "#666", 
                marginLeft: "10px" 
              }}>
                {bookingData.transport.vehicleType} • 3 days
              </div>
            </div>
          )}

          {/* Accommodations */}
          {bookingData.accommodations && bookingData.accommodations.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ color: "#4a7c59", fontSize: "1rem", marginBottom: "10px" }}>Accommodations</h4>
              {bookingData.accommodations.map((accommodation, index) => (
                <div key={index} style={{ marginBottom: "8px" }}>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    marginBottom: "2px",
                    fontSize: "0.9rem"
                  }}>
                    <span style={{ color: "#666" }}>{accommodation.name}</span>
                    <span style={{ color: "#2d5a27", fontWeight: "600" }}>
                      {getCurrencySymbol()}{accommodation.price * 3}
                    </span>
                  </div>
                  <div style={{ 
                    fontSize: "0.8rem", 
                    color: "#666", 
                    marginLeft: "10px" 
                  }}>
                    {accommodation.type} • 3 nights
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Activities */}
          {bookingData.activities && bookingData.activities.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ color: "#4a7c59", fontSize: "1rem", marginBottom: "10px" }}>Activities</h4>
              {bookingData.activities.map((activity, index) => (
                <div key={index} style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  marginBottom: "5px",
                  fontSize: "0.9rem"
                }}>
                  <span style={{ color: "#666" }}>• {activity.name}</span>
                  <span style={{ color: "#2d5a27", fontWeight: "600" }}>
                    {activity.price > 0 ? `${getCurrencySymbol()}$${activity.price}` : "Free"}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div style={{ 
            borderTop: "2px solid #e8f5e8", 
            paddingTop: "15px",
            marginTop: "20px"
          }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              fontSize: "1.1rem",
              fontWeight: "bold",
              color: "#2d5a27"
            }}>
              <span>Total Cost</span>
              <span>{getCurrencySymbol()}${total.toFixed(2)}</span>
            </div>
            <div style={{ 
              fontSize: "0.8rem", 
              color: "#666", 
              marginTop: "5px",
              textAlign: "center"
            }}>
              * Final pricing may vary based on availability
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;
