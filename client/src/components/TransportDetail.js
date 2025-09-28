import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import BookingForm from "./BookingForm";

const TransportDetail = () => {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgIndex, setImgIndex] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/transport-providers/${id}`);
        setProvider(res.data);
        setError(null);
        setImgIndex(0);
      } catch (err) {
        setError("Failed to load provider details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProvider();
  }, [id]);

  const next = () => {
    if (!provider?.images?.length) return;
    setImgIndex((imgIndex + 1) % provider.images.length);
  };
  const prev = () => {
    if (!provider?.images?.length) return;
    setImgIndex((imgIndex - 1 + provider.images.length) % provider.images.length);
  };

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <h3>Loading...</h3>
      </div>
    );
  }
  if (error || !provider) {
    return (
      <div style={{ padding: 24, textAlign: "center", color: "#b23b3b" }}>
        <h3>Error</h3>
        <p>{error || "Provider not found"}</p>
        <Link to="/transport" style={{ color: "#4a7c59", textDecoration: "none", fontWeight: 600 }}>
          ← Back to Transport
        </Link>
      </div>
    );
  }

  if (showBookingForm) {
    return (
      <BookingForm
        provider={provider}
        onSuccess={() => setShowBookingForm(false)}
        onCancel={() => setShowBookingForm(false)}
      />
    );
  }

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
    return symbols[currency] || currency || "";
  };

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ marginBottom: 16 }}>
        <Link to="/transport" style={{ color: "#4a7c59", textDecoration: "none", fontWeight: 600 }}>
          ← Back to Transport
        </Link>
      </div>

      {/* Top: vehicle emphasized, owner shown here only */}
      <h2 style={{ margin: 0, color: "#1f4b1a" }}>
        {(provider.vehicleBrand || provider.vehicleModel)
          ? `${provider.vehicleBrand || ""} ${provider.vehicleModel || ""}`.trim()
          : provider.vehicleType}
      </h2>
      <p style={{ marginTop: 6, color: "#2d7a50", fontWeight: 700 }}>{provider.vehicleType}</p>
      <p style={{ margin: "2px 0 0 0", color: "#4a7c59" }}>
        <strong>Owner:</strong> {provider.name}
      </p>

      {/* Normal-sized image carousel */}
      <div style={{
        position: "relative",
        width: "100%",
        maxWidth: 900,
        margin: "16px auto",
        borderRadius: 12,
        overflow: "hidden",
        background: "#f0f7f0",
        boxShadow: "0 6px 18px rgba(74, 124, 89, 0.18)"
      }}>
        <div style={{ paddingTop: "56.25%" }} />
        {provider.images?.length ? (
          <img
            src={`http://localhost:5000${provider.images[imgIndex]}`}
            alt={`${provider.name} ${imgIndex + 1}`}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#3d6b4a" }}>
            No images
          </div>
        )}

        {/* Arrows */}
        {provider.images?.length > 1 && (
          <>
            <button onClick={prev} style={{ position: "absolute", top: "50%", left: 8, transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", color: "white", border: "none", borderRadius: 8, padding: "8px 10px", cursor: "pointer" }}>
              ‹
            </button>
            <button onClick={next} style={{ position: "absolute", top: "50%", right: 8, transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", color: "white", border: "none", borderRadius: 8, padding: "8px 10px", cursor: "pointer" }}>
              ›
            </button>
          </>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 24 }}>
        <div style={{ background: "white", padding: 18, borderRadius: 12, border: "1px solid #e8f5e8" }}>
          <h4 style={{ marginTop: 0, color: "#2d5a27" }}>Details</h4>
          <p style={{ margin: "0 0 10px 0" }}><strong>Seats:</strong> {provider.seats}</p>
          <p style={{ margin: "0 0 10px 0" }}><strong>Availability:</strong> {provider.availability ? "Available" : "Booked"}</p>
          {provider.vehicleBrand || provider.vehicleModel ? (
            <p style={{ margin: "0 0 10px 0" }}><strong>Vehicle:</strong> {provider.vehicleBrand} {provider.vehicleModel}</p>
          ) : null}
          {provider.contact ? (
            <p style={{ margin: "0 0 10px 0" }}><strong>Contact:</strong> {provider.contact}</p>
          ) : null}
          {provider.email ? (
            <p style={{ margin: "0 0 10px 0" }}><strong>Email:</strong> {provider.email}</p>
          ) : null}
        </div>
        <div style={{ background: "white", padding: 18, borderRadius: 12, border: "1px solid #e8f5e8" }}>
          <h4 style={{ marginTop: 0, color: "#2d5a27" }}>Pricing</h4>
          <p style={{ margin: "0 0 10px 0" }}>
            <strong>Price:</strong> {getCurrencySymbol(provider.currency || 'USD')}{provider.price} {provider.priceUnit}
          </p>
          {provider.description && (
            <p style={{ marginTop: 8 }}>
              <strong>Notes:</strong> {provider.description}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={() => setShowBookingForm(true)}
        disabled={!provider.availability}
        style={{
          padding: "12px 24px",
          background: provider.availability ? "linear-gradient(135deg, #4a7c59, #3f6e4d)" : "#6c757d",
          color: "white",
          border: "none",
          borderRadius: 10,
          fontSize: 16,
          fontWeight: 700,
          cursor: provider.availability ? "pointer" : "not-allowed",
          boxShadow: "0 6px 14px rgba(74, 124, 89, 0.28)"
        }}
      >
        {provider.availability ? "Book Now" : "Not Available"}
      </button>
    </div>
  );
};

export default TransportDetail;
