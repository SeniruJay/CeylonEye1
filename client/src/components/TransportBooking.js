import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import BookingForm from "./BookingForm";
import {
  RefreshCw,
  XCircle,
  CheckCircle,
  Car as CarIcon,
  Bus as BusIcon,
  Bike as BikeIcon,
} from "lucide-react";

// ✅ Hover carousel for multiple images
const HoverCarousel = ({ images = [], alt = "" }) => {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    setIndex(0);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [images.join(",")]);

  const start = () => {
    if (timerRef.current || !images || images.length <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 1400);
  };

  const stop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  if (!images || images.length === 0) return null;

  return (
    <img
      src={images[index]} // ✅ Already mapped with base URL
      alt={alt}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transform: "scale(1.02)",
        transition: "transform 0.6s ease",
      }}
      onMouseEnter={start}
      onMouseLeave={stop}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "scale(1.06)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "scale(1.02)";
      }}
    />
  );
};

const TransportBooking = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [filters, setFilters] = useState({
    vehicleType: "",
    seats: "",
    currency: "",
    priceMin: "",
    priceMax: "",
  });

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
      setError("Failed to fetch transport providers.");
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
    fetchProviders();
  };

  const getVehicleIcon = (vehicleType) => {
    const style = { width: 24, height: 24, color: "#2d7a50" };
    switch (vehicleType) {
      case "Car":
      case "Van":
        return <CarIcon style={style} />;
      case "Bus":
      case "Truck":
        return <BusIcon style={style} />;
      case "Motorcycle":
      case "Bicycle":
        return <BikeIcon style={style} />;
      default:
        return <CarIcon style={style} />;
    }
  };

  const getCurrencySymbol = (currency) => {
    const symbols = {
      LKR: "Rs.",
      USD: "$",
      EUR: "€",
      GBP: "£",
      AUD: "A$",
      CAD: "C$",
      JPY: "¥",
      INR: "₹",
    };
    return symbols[currency] || currency;
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#2d7a50",
          gap: 8,
        }}
      >
        <RefreshCw
          style={{ width: 40, height: 40, animation: "spin 1s linear infinite" }}
        />
        <p style={{ fontSize: 18, fontWeight: 600 }}>
          Loading transport options...
        </p>
        <style>{`@keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#b23b3b",
          gap: 12,
        }}
      >
        <XCircle style={{ width: 40, height: 40 }} />
        <p style={{ fontSize: 18, fontWeight: 600 }}>{error}</p>
        <button
          onClick={fetchProviders}
          style={{
            padding: "10px 20px",
            background: "#2d7a50",
            color: "white",
            border: "none",
            borderRadius: 10,
            fontWeight: 700,
            cursor: "pointer",
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

  const allVehicleTypes = Array.from(
    new Set(providers.map((p) => p.vehicleType))
  ).filter(Boolean);

  const filteredProviders = providers.filter((p) => {
    const byType = filters.vehicleType ? p.vehicleType === filters.vehicleType : true;
    const bySeats = filters.seats ? Number(p.seats) === Number(filters.seats) : true;
    const byCurrency = filters.currency ? p.currency === filters.currency : true;
    const price = Number(p.price || 0);
    const byPriceMin = filters.priceMin !== "" ? price >= Number(filters.priceMin) : true;
    const byPriceMax = filters.priceMax !== "" ? price <= Number(filters.priceMax) : true;

    return byType && bySeats && byCurrency && byPriceMin && byPriceMax;
  });

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url('https://plus.unsplash.com/premium_photo-1716999430033-82bfa6136013?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dG91cmlzdCUyMGJ1c3xlbnwwfHwwfHx8MA%3D%3D')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(3px) brightness(0.7)",
          zIndex: 0,
        }}
      />

      {/* Foreground */}
      <div style={{ position: "relative", zIndex: 1, padding: "32px" }}>
        {/* Banner */}
        <div
          style={{
            position: "relative",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "24px 20px",
            borderRadius: 16,
            background:
              "linear-gradient(rgba(180, 177, 177, 0.45), rgba(0,0,0,0.55)), url('https://images.pexels.com/photos/8230896/pexels-photo-8230896.jpeg') center/cover no-repeat",
            minHeight: 220,
            boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              color: "#ecfff5",
              textShadow: "0 2px 6px rgba(0,0,0,0.25)",
              marginBottom: 6,
              fontSize: "2.2rem",
              fontWeight: 800,
            }}
          >
            🚐 Book Your Transport
          </h1>
          <p style={{ color: "#f6fffa", fontSize: "1rem", fontWeight: 500 }}>
            Choose from trusted providers across Sri Lanka
          </p>
        </div>

        {/* Filters */}
        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.9)",
            borderRadius: 16,
            padding: 20,
            margin: "20px auto",
            maxWidth: 1200,
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            <select
              value={filters.vehicleType}
              onChange={(e) => setFilters({ ...filters, vehicleType: e.target.value })}
              style={{
                padding: 12,
                borderRadius: 10,
                border: "2px solid #e8f5e8",
                background: "#fff",
              }}
            >
              <option value="">Any vehicle type</option>
              {allVehicleTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              placeholder="Seats"
              value={filters.seats}
              onChange={(e) => setFilters({ ...filters, seats: e.target.value })}
              style={{
                padding: 12,
                borderRadius: 10,
                border: "2px solid #e8f5e8",
              }}
            />
            <select
              value={filters.currency}
              onChange={(e) => setFilters({ ...filters, currency: e.target.value })}
              style={{
                padding: 12,
                borderRadius: 10,
                border: "2px solid #e8f5e8",
                background: "#fff",
              }}
            >
              <option value="">Any currency</option>
              <option value="LKR">LKR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
            <input
              type="number"
              min="0"
              placeholder="Price Min"
              value={filters.priceMin}
              onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
              style={{
                padding: 12,
                borderRadius: 10,
                border: "2px solid #e8f5e8",
              }}
            />
            <input
              type="number"
              min="0"
              placeholder="Price Max"
              value={filters.priceMax}
              onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
              style={{
                padding: 12,
                borderRadius: 10,
                border: "2px solid #e8f5e8",
              }}
            />
          </div>
        </div>

        {/* Providers */}
        {filteredProviders.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: 40,
              background: "white",
              borderRadius: 12,
              border: "2px dashed #4a7c59",
              maxWidth: 800,
              margin: "0 auto",
            }}
          >
            <h3 style={{ color: "#4a7c59", marginBottom: 10 }}>
              No matching providers
            </h3>
            <p style={{ color: "#666" }}>
              Try adjusting the filters or clear them.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
              gap: 24,
              marginTop: 24,
            }}
          >
            {filteredProviders.map((provider) => (
              <div
                key={provider._id}
                style={{
                  background: "white",
                  borderRadius: 16,
                  padding: 20,
                  boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                  transition: "0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow =
                    "0 14px 28px rgba(0,0,0,0.18)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 18px rgba(0,0,0,0.1)";
                }}
              >
                {/* Image */}
                <div style={{ marginBottom: 14 }}>
                  <div
                    style={{
                      width: "100%",
                      position: "relative",
                      borderRadius: 12,
                      overflow: "hidden",
                      background: "#f0f7f0",
                    }}
                  >
                    <div style={{ paddingTop: "56.25%" }} />
                    {provider.images?.length > 0 ? (
                      <HoverCarousel
                        images={provider.images.map((img) =>
                          img.startsWith("http")
                            ? img
                            : `http://localhost:5000${img}`
                        )}
                        alt={provider.name}
                      />
                    ) : (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "4rem",
                          color: "#3d6b4a",
                        }}
                      >
                        {getVehicleIcon(provider.vehicleType)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Info */}
                <h3 style={{ margin: 0, color: "#2d7a50" }}>
                  {provider.vehicleType} • {provider.vehicleBrand}{" "}
                  {provider.vehicleModel}
                </h3>
                <p style={{ margin: "6px 0", color: "#444" }}>
                  Seats: {provider.seats} | Price:{" "}
                  {getCurrencySymbol(provider.currency)} {provider.price}{" "}
                  {provider.priceUnit}
                </p>
                <p
                  style={{
                    margin: "6px 0",
                    color: provider.availability ? "#2d7a50" : "#b23b3b",
                    fontWeight: 700,
                  }}
                >
                  {provider.availability ? (
                    <>
                      <CheckCircle style={{ width: 16, height: 16 }} /> Available
                    </>
                  ) : (
                    <>
                      <XCircle style={{ width: 16, height: 16 }} /> Booked
                    </>
                  )}
                </p>
                <button
                  onClick={() => handleBookNow(provider)}
                  disabled={!provider.availability}
                  style={{
                    marginTop: 12,
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "none",
                    background: provider.availability ? "#2d7a50" : "#94a3b8",
                    color: "white",
                    fontWeight: 700,
                    cursor: provider.availability ? "pointer" : "not-allowed",
                  }}
                >
                  {provider.availability ? "Book Now" : "Not Available"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransportBooking;
