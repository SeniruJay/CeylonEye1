import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";

const EditTransportProvider = () => {
  const { id } = useParams();
  const [form, setForm] = useState({
    name: "",
    contact: "",
    vehicleType: "",
    availability: true,
    seats: 4,
    price: 0,
    priceUnit: "per day",
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProvider();
  }, [id]);

  const fetchProvider = async () => {
    try {
      setFetching(true);
      const res = await axios.get(`http://localhost:5000/api/transport-providers`);
      const provider = res.data.find(p => p._id === id);
      if (provider) {
        setForm(provider);
        setError(null);
      } else {
        setError("Transport provider not found");
      }
    } catch (err) {
      setError("Failed to fetch transport provider details");
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.put(`http://localhost:5000/api/transport-providers/${id}`, form);
      alert("Transport provider updated successfully!");
      navigate("/");
    } catch (err) {
      setError("Failed to update transport provider. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h2>Loading transport provider details...</h2>
      </div>
    );
  }

  if (error && !form.name) {
    return (
      <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
        <h2>Error</h2>
        <p>{error}</p>
        <Link 
          to="/admin"
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "10px 20px",
            textDecoration: "none",
            borderRadius: "4px",
            marginTop: "10px",
            display: "inline-block"
          }}
        >
          Back to Transport Providers
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ marginBottom: "20px" }}>
        <Link 
          to="/admin" 
          style={{
            color: "#4a7c59",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "500"
          }}
        >
          ← Back to Transport Providers
        </Link>
      </div>

      <h2>Edit Transport Provider</h2>
      
      {error && (
        <div style={{
          backgroundColor: "#f8d7da",
          color: "#721c24",
          padding: "10px",
          borderRadius: "4px",
          marginBottom: "20px",
          border: "1px solid #f5c6cb"
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(74, 124, 89, 0.15)",
        border: "1px solid #e8f5e8"
      }}>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
            Provider Name *
          </label>
          <input 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            required 
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ced4da",
              borderRadius: "4px",
              fontSize: "16px",
              boxSizing: "border-box"
            }}
            placeholder="Enter provider name"
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
            Contact Information *
          </label>
          <input 
            name="contact" 
            value={form.contact} 
            onChange={handleChange} 
            required 
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ced4da",
              borderRadius: "4px",
              fontSize: "16px",
              boxSizing: "border-box"
            }}
            placeholder="Enter phone number or email"
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
            Vehicle Type *
          </label>
          <select 
            name="vehicleType" 
            value={form.vehicleType} 
            onChange={handleChange} 
            required 
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ced4da",
              borderRadius: "4px",
              fontSize: "16px",
              boxSizing: "border-box",
              backgroundColor: "white"
            }}
          >
            <option value="">Select vehicle type</option>
            <option value="Car">Car</option>
            <option value="Van">Van</option>
            <option value="Bus">Bus</option>
            <option value="Motorcycle">Motorcycle</option>
            <option value="Bicycle">Bicycle</option>
            <option value="Tuk-tuk">Tuk-tuk</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
              Number of Seats *
            </label>
            <input 
              type="number"
              name="seats" 
              value={form.seats} 
              onChange={handleChange} 
              required 
              min="1"
              max="50"
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ced4da",
                borderRadius: "4px",
                fontSize: "16px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
              Price *
            </label>
            <input 
              type="number"
              name="price" 
              value={form.price} 
              onChange={handleChange} 
              required 
              min="0"
              step="0.01"
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ced4da",
                borderRadius: "4px",
                fontSize: "16px",
                boxSizing: "border-box"
              }}
              placeholder="Enter price"
            />
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
            Price Unit
          </label>
          <select 
            name="priceUnit" 
            value={form.priceUnit} 
            onChange={handleChange} 
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ced4da",
              borderRadius: "4px",
              fontSize: "16px",
              boxSizing: "border-box",
              backgroundColor: "white"
            }}
          >
            <option value="per day">Per Day</option>
            <option value="per hour">Per Hour</option>
            <option value="per trip">Per Trip</option>
            <option value="per km">Per Kilometer</option>
          </select>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
            Description
          </label>
          <textarea 
            name="description" 
            value={form.description} 
            onChange={handleChange} 
            rows="3"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ced4da",
              borderRadius: "4px",
              fontSize: "16px",
              boxSizing: "border-box",
              resize: "vertical"
            }}
            placeholder="Enter description (optional)"
          />
        </div>

        <div style={{ marginBottom: "30px" }}>
          <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
            <input 
              type="checkbox" 
              name="availability" 
              checked={form.availability} 
              onChange={handleChange}
              style={{ marginRight: "8px", transform: "scale(1.2)" }}
            />
            <span style={{ fontWeight: "500" }}>Currently Available</span>
          </label>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button 
            type="submit" 
            disabled={loading}
            style={{
              backgroundColor: loading ? "#6c757d" : "#4a7c59",
              color: "white",
              padding: "12px 24px",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "500",
              cursor: loading ? "not-allowed" : "pointer",
              flex: "1",
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
            {loading ? "Updating..." : "Update Provider"}
          </button>
          
          <Link 
            to="/admin"
            style={{
              backgroundColor: "#6c757d",
              color: "white",
              padding: "12px 24px",
              textDecoration: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "500",
              textAlign: "center",
              flex: "1",
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
          </Link>
        </div>
      </form>
    </div>
  );
};

export default EditTransportProvider;
