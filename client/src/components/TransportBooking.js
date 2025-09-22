import React, { useEffect, useState } from "react";
import axios from "axios";
import BookingForm from "./BookingForm";

const TransportBooking = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/transport-providers");
      setProviders(res.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch transport providers. Please check if the server is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (provider) => {
    setSelectedProvider(provider);
    setShowBookingForm(true);
  };

  const handleBookingSuccess = () => {
    setShowBookingForm(false);
    setSelectedProvider(null);
    // Optionally refresh the providers list
    fetchProviders();
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

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h2 style={{ color: "#4a7c59" }}>Loading transport options...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "red" }}>
        <h2>Error</h2>
        <p>{error}</p>
        <button 
          onClick={fetchProviders} 
          style={{ 
            padding: "10px 20px", 
            marginTop: "10px",
            backgroundColor: "#4a7c59",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (showBookingForm && selectedProvider) {
    return (
      <BookingForm 
        provider={selectedProvider}
        onSuccess={handleBookingSuccess}
        onCancel={() => {
          setShowBookingForm(false);
          setSelectedProvider(null);
        }}
      />
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "#2d5a27", marginBottom: "10px" }}>
          🚗 Book Your Transport
        </h1>
        <p style={{ color: "#4a7c59", fontSize: "1.1rem" }}>
          Choose from our available transport providers
        </p>
      </div>

      {providers.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "40px", 
          backgroundColor: "white", 
          borderRadius: "12px",
          boxShadow: "0 4px 8px rgba(74, 124, 89, 0.1)",
          border: "2px dashed #4a7c59"
        }}>
          <h3 style={{ color: "#4a7c59", marginBottom: "10px" }}>No transport providers available</h3>
          <p style={{ color: "#666" }}>Please check back later or contact us for assistance.</p>
        </div>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", 
          gap: "20px",
          maxWidth: "1200px",
          margin: "0 auto"
        }}>
          {providers.map(provider => (
            <div 
              key={provider._id}
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "25px",
                boxShadow: "0 4px 12px rgba(74, 124, 89, 0.15)",
                border: "1px solid #e8f5e8",
                transition: "transform 0.3s ease, box-shadow 0.3s ease"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(74, 124, 89, 0.2)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(74, 124, 89, 0.15)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
                <div style={{ 
                  fontSize: "2.5rem", 
                  marginRight: "15px",
                  backgroundColor: "#f0f7f0",
                  padding: "10px",
                  borderRadius: "50%",
                  width: "60px",
                  height: "60px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  {getVehicleIcon(provider.vehicleType)}
                </div>
                <div>
                  <h3 style={{ 
                    margin: "0", 
                    color: "#2d5a27", 
                    fontSize: "1.3rem",
                    fontWeight: "600"
                  }}>
                    {provider.name}
                  </h3>
                  <p style={{ 
                    margin: "5px 0 0 0", 
                    color: "#4a7c59", 
                    fontSize: "1rem",
                    fontWeight: "500"
                  }}>
                    {provider.vehicleType}
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  marginBottom: "8px",
                  padding: "8px 0",
                  borderBottom: "1px solid #f0f7f0"
                }}>
                  <span style={{ color: "#666", fontWeight: "500" }}>Seats:</span>
                  <span style={{ color: "#2d5a27", fontWeight: "600" }}>{provider.seats}</span>
                </div>
                
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  marginBottom: "8px",
                  padding: "8px 0",
                  borderBottom: "1px solid #f0f7f0"
                }}>
                  <span style={{ color: "#666", fontWeight: "500" }}>Price:</span>
                  <span style={{ color: "#2d5a27", fontWeight: "600" }}>
                    ${provider.price} {provider.priceUnit}
                  </span>
                </div>

                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  padding: "8px 0"
                }}>
                  <span style={{ color: "#666", fontWeight: "500" }}>Status:</span>
                  <span style={{
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    backgroundColor: provider.availability ? "#d4edda" : "#f8d7da",
                    color: provider.availability ? "#2d5a27" : "#721c24",
                    border: provider.availability ? "1px solid #4a7c59" : "1px solid #dc3545"
                  }}>
                    {provider.availability ? "Available ✅" : "Fully Booked ❌"}
                  </span>
                </div>
              </div>

              {provider.description && (
                <div style={{ 
                  marginBottom: "20px", 
                  padding: "10px",
                  backgroundColor: "#f8fff8",
                  borderRadius: "6px",
                  border: "1px solid #e8f5e8"
                }}>
                  <p style={{ 
                    margin: "0", 
                    color: "#4a7c59", 
                    fontSize: "0.9rem",
                    fontStyle: "italic"
                  }}>
                    {provider.description}
                  </p>
                </div>
              )}

              <button
                onClick={() => handleBookNow(provider)}
                disabled={!provider.availability}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: provider.availability ? "#4a7c59" : "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: provider.availability ? "pointer" : "not-allowed",
                  boxShadow: "0 2px 4px rgba(74, 124, 89, 0.3)",
                  transition: "all 0.3s ease"
                }}
                onMouseOver={(e) => {
                  if (provider.availability) {
                    e.target.style.backgroundColor = "#3d6b4a";
                    e.target.style.transform = "translateY(-2px)";
                  }
                }}
                onMouseOut={(e) => {
                  if (provider.availability) {
                    e.target.style.backgroundColor = "#4a7c59";
                    e.target.style.transform = "translateY(0)";
                  }
                }}
              >
                {provider.availability ? "Book Now" : "Not Available"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransportBooking;
