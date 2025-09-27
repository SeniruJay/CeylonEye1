import React, { useEffect, useState } from "react";
import axios from "axios";
import BookingForm from "./BookingForm";
import { RefreshCw, XCircle, CheckCircle, Car as CarIcon, Bus as BusIcon, Bike as BikeIcon } from "lucide-react";

const TransportBooking = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [filters, setFilters] = useState({ vehicleType: "", seats: "" });

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
    const style = { width: 24, height: 24, color: "#2d7a50" };
    switch (vehicleType) {
      case 'Car': return <CarIcon style={style} />;
      case 'Van': return <CarIcon style={style} />;
      case 'Bus': return <BusIcon style={style} />;
      case 'Motorcycle': return <BikeIcon style={style} />;
      case 'Bicycle': return <BikeIcon style={style} />;
      case 'Truck': return <BusIcon style={style} />;
      default: return <CarIcon style={style} />;
    }
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

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#2d7a50",
        gap: 8,
        background: "linear-gradient(120deg, #f5fff6, #e9f7ef, #f5fff6)"
      }}>
        <RefreshCw style={{ width: 40, height: 40, animation: "spin 1s linear infinite" }} />
        <p style={{ fontSize: 18, fontWeight: 600 }}>Loading transport options...</p>
        <style>{`@keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#b23b3b",
        gap: 12,
        background: "linear-gradient(120deg, #fff5f5, #ffecec, #fff5f5)"
      }}>
        <XCircle style={{ width: 40, height: 40 }} />
        <p style={{ fontSize: 18, fontWeight: 600 }}>{error}</p>
        <button
          onClick={fetchProviders}
          style={{
            padding: "10px 20px",
            background: "linear-gradient(135deg, #4a7c59, #3f6e4d)",
            color: "white",
            border: "none",
            borderRadius: 10,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 6px 14px rgba(74,124,89,.25)"
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

  const allVehicleTypes = Array.from(new Set(providers.map(p => p.vehicleType))).filter(Boolean);
  const filteredProviders = providers.filter(p => {
    const byType = filters.vehicleType ? p.vehicleType === filters.vehicleType : true;
    const bySeats = filters.seats ? Number(p.seats) === Number(filters.seats) : true;
    // If either matches, include (OR logic). If no filters, include all.
    if (!filters.vehicleType && !filters.seats) return true;
    return (filters.vehicleType && byType) || (filters.seats && bySeats);
  });

  return (
    <div style={{
      minHeight: "100vh",
      padding: "24px",
      background: "linear-gradient(120deg, #f5fff6, #e9f7ef, #f5fff6)",
      backgroundSize: "200% 200%",
      animation: "bgShift 16s ease infinite"
    }}>
      {/* Inline keyframes for animated gradient */}
      <style>{`
        @keyframes bgShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h1 style={{ color: "#1f4b1a", marginBottom: 8, fontSize: "2rem", letterSpacing: 0.3 }}>
          🚗 Book Your Transport
        </h1>
        <p style={{ color: "#4a7c59", fontSize: "1.05rem" }}>
          Choose from our available transport providers
        </p>
      </div>

      {/* Filters */}
      <div style={{
        backgroundColor: "white",
        borderRadius: 14,
        padding: 16,
        marginBottom: 24,
        boxShadow: "0 8px 16px rgba(74, 124, 89, 0.12)",
        border: "1px solid #e8f5e8",
        maxWidth: 1000,
        marginInline: "auto"
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
          <div>
            <label style={{ display: "block", marginBottom: 6, color: "#2d5a27", fontWeight: 700, fontSize: 14 }}>Vehicle Type</label>
            <select
              value={filters.vehicleType}
              onChange={(e) => setFilters({ ...filters, vehicleType: e.target.value })}
              style={{ width: "100%", padding: 12, borderRadius: 10, border: "2px solid #e8f5e8", background: "#fff", fontWeight: 600 }}
            >
              <option value="">Any</option>
              {allVehicleTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: 6, color: "#2d5a27", fontWeight: 700, fontSize: 14 }}>Seats</label>
            <input
              type="number"
              min="1"
              placeholder="Any"
              value={filters.seats}
              onChange={(e) => setFilters({ ...filters, seats: e.target.value })}
              style={{ width: "100%", padding: 12, borderRadius: 10, border: "2px solid #e8f5e8", fontWeight: 600 }}
            />
          </div>
          <div style={{ alignSelf: "end", display: "flex", gap: 8 }}>
            <button
              onClick={() => setFilters({ vehicleType: "", seats: "" })}
              style={{ padding: "12px 16px", background: "#eef7f0", color: "#2d7a50", border: "2px solid #cfe3cf", borderRadius: 10, fontWeight: 800 }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {filteredProviders.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "40px", 
          backgroundColor: "white", 
          borderRadius: "12px",
          boxShadow: "0 4px 8px rgba(74, 124, 89, 0.1)",
          border: "2px dashed #4a7c59"
        }}>
          <h3 style={{ color: "#4a7c59", marginBottom: "10px" }}>No matching transport providers</h3>
          <p style={{ color: "#666" }}>Try adjusting the filters or clear them to see all options.</p>
        </div>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
          gap: 24,
          maxWidth: "1400px",
          margin: "0 auto"
        }}>
          {filteredProviders.map(provider => (
            <div 
              key={provider._id}
              style={{
                backgroundColor: "white",
                borderRadius: 16,
                padding: 20,
                boxShadow: "0 6px 18px rgba(74, 124, 89, 0.18)",
                border: "1px solid #e8f5e8",
                transition: "transform 0.35s ease, box-shadow 0.35s ease",
                overflow: "hidden"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-6px) scale(1.01)";
                e.currentTarget.style.boxShadow = "0 16px 28px rgba(74, 124, 89, 0.22)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 6px 18px rgba(74, 124, 89, 0.18)";
              }}
            >
              {/* Image Area with 16:9 ratio */}
              <div style={{ marginBottom: 16 }}>
                <div style={{
                  width: "100%",
                  position: "relative",
                  borderRadius: 12,
                  overflow: "hidden",
                  backgroundColor: "#f0f7f0"
                }}>
                  <div style={{ paddingTop: "56.25%" }} />
                  {provider.images && provider.images.length > 0 ? (
                    <img
                      src={`http://localhost:5000${provider.images[0]}`}
                      alt={provider.name}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transform: "scale(1.02)",
                        transition: "transform 0.6s ease"
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallback = e.target.nextSibling;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = "scale(1.06)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = "scale(1.02)";
                      }}
                    />
                  ) : null}
                  {/* Fallback icon */}
                  <div style={{
                    display: provider.images && provider.images.length > 0 ? 'none' : 'flex',
                    position: "absolute",
                    inset: 0,
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "4rem",
                    color: "#3d6b4a",
                    background: "linear-gradient(135deg, #f6fff8, #eaf7ef)"
                  }}>
                    {getVehicleIcon(provider.vehicleType)}
                  </div>

                  {provider.images && provider.images.length > 1 && (
                    <div style={{
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      backgroundColor: "rgba(0,0,0,0.65)",
                      color: "white",
                      padding: "4px 10px",
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 700,
                      backdropFilter: "blur(2px)"
                    }}>
                      +{provider.images.length - 1} more
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {getVehicleIcon(provider.vehicleType)}
                  <div>
                    <h3 style={{ 
                      margin: 0, 
                      color: "#1f4b1a", 
                      fontSize: "1.1rem",
                      fontWeight: 800
                    }}>
                      {provider.name}
                    </h3>
                    <p style={{ 
                      margin: "4px 0 0 0", 
                      color: "#2d7a50", 
                      fontSize: ".9rem",
                      fontWeight: 600
                    }}>
                      {provider.vehicleType}
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  marginBottom: 8,
                  padding: "8px 0",
                  borderBottom: "1px solid #f0f7f0"
                }}>
                  <span style={{ color: "#666", fontWeight: "500" }}>Seats:</span>
                  <span style={{ color: "#2d5a27", fontWeight: "600" }}>{provider.seats}</span>
                </div>
                
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  marginBottom: 8,
                  padding: "8px 0",
                  borderBottom: "1px solid #f0f7f0"
                }}>
                  <span style={{ color: "#666", fontWeight: "500" }}>Price:</span>
                  <span style={{ color: "#2d5a27", fontWeight: "600" }}>
                    {getCurrencySymbol(provider.currency || 'USD')}{provider.price} {provider.priceUnit}
                  </span>
                </div>

                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  padding: "8px 0"
                }}>
                  <span style={{ color: "#666", fontWeight: 600 }}>Status:</span>
                  {provider.availability ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#2d7a50', fontWeight: 700 }}>
                      <CheckCircle style={{ width: 16, height: 16 }} /> Available
                    </span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#b23b3b', fontWeight: 700 }}>
                      <XCircle style={{ width: 16, height: 16 }} /> Booked
                    </span>
                  )}
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
                  background: provider.availability ? "linear-gradient(135deg, #4a7c59, #3f6e4d)" : "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: provider.availability ? "pointer" : "not-allowed",
                  boxShadow: "0 6px 14px rgba(74, 124, 89, 0.28)",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease, background 0.4s ease"
                }}
                onMouseOver={(e) => {
                  if (provider.availability) {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 12px 22px rgba(74, 124, 89, 0.35)";
                  }
                }}
                onMouseOut={(e) => {
                  if (provider.availability) {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 6px 14px rgba(74, 124, 89, 0.28)";
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
