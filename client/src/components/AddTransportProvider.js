import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const AddTransportProvider = () => {
  const [form, setForm] = useState({
    // Personal information
    name: "",
    contact: "",
    email: "",
    // Vehicle information
    vehicleType: "",
    vehicleBrand: "",
    vehicleModel: "",
    seats: 4,
    // Charges & fees
    price: 0,
    currency: "LKR",
    priceUnit: "per day",
    // Other
    availability: true,
    description: "",
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageFiles.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }
    
    setImageFiles(prev => [...prev, ...files]);
    
    // Create preview URLs
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      
      // Add form fields
      Object.keys(form).forEach(key => {
        if (key !== 'images') {
          formData.append(key, form[key]);
        }
      });
      
      // Add image files
      imageFiles.forEach((file, index) => {
        formData.append('images', file);
      });

      await axios.post("http://localhost:5000/api/transport-providers", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert("Transport provider added successfully!");
      navigate("/");
    } catch (err) {
      setError("Failed to add transport provider. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
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

      <h2>Add New Transport Provider</h2>
      
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
        {/* Section 1: Personal Information */}
        <div style={{
          marginBottom: "24px",
          border: "1px solid #e8f5e8",
          borderRadius: "10px",
          padding: "20px",
          background: "#fbfffb"
        }}>
          <h3 style={{ marginTop: 0, color: "#2d5a27" }}>Personal Information</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>Owner Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: 12, border: "2px solid #e8f5e8", borderRadius: 8, fontSize: 16 }}
                placeholder="Enter owner's name"
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>Contact Number *</label>
              <input
                name="contact"
                value={form.contact}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: 12, border: "2px solid #e8f5e8", borderRadius: 8, fontSize: 16 }}
                placeholder="Enter contact number"
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                style={{ width: "100%", padding: 12, border: "2px solid #e8f5e8", borderRadius: 8, fontSize: 16 }}
                placeholder="Enter email (optional)"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Vehicle Information */}
        <div style={{
          marginBottom: "24px",
          border: "1px solid #e8f5e8",
          borderRadius: "10px",
          padding: "20px",
          background: "#fbfffb"
        }}>
          <h3 style={{ marginTop: 0, color: "#2d5a27" }}>Vehicle Information</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>Vehicle Type *</label>
              <select
                name="vehicleType"
                value={form.vehicleType}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: 12, border: "2px solid #e8f5e8", borderRadius: 8, fontSize: 16, background: "white" }}
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
            <div>
              <label style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>Vehicle Brand</label>
              <input
                name="vehicleBrand"
                value={form.vehicleBrand}
                onChange={handleChange}
                style={{ width: "100%", padding: 12, border: "2px solid #e8f5e8", borderRadius: 8, fontSize: 16 }}
                placeholder="e.g. Toyota"
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>Vehicle Model</label>
              <input
                name="vehicleModel"
                value={form.vehicleModel}
                onChange={handleChange}
                style={{ width: "100%", padding: 12, border: "2px solid #e8f5e8", borderRadius: 8, fontSize: 16 }}
                placeholder="e.g. Prius"
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>Number of Seats *</label>
              <input
                type="number"
                name="seats"
                value={form.seats}
                onChange={handleChange}
                required
                min="1"
                max="50"
                style={{ width: "100%", padding: 12, border: "2px solid #e8f5e8", borderRadius: 8, fontSize: 16 }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>Description</label>
              <input
                name="description"
                value={form.description}
                onChange={handleChange}
                style={{ width: "100%", padding: 12, border: "2px solid #e8f5e8", borderRadius: 8, fontSize: 16 }}
                placeholder="Optional notes about the vehicle"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Charges & Fees */}
        <div style={{
          marginBottom: "24px",
          border: "1px solid #e8f5e8",
          borderRadius: "10px",
          padding: "20px",
          background: "#fbfffb"
        }}>
          <h3 style={{ marginTop: 0, color: "#2d5a27" }}>Charges & Fees</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>Currency *</label>
              <select 
                name="currency" 
                value={form.currency} 
                onChange={handleChange} 
                required 
                style={{ width: "100%", padding: 12, border: "2px solid #e8f5e8", borderRadius: 8, fontSize: 16, background: "white" }}
              >
                <option value="LKR">Sri Lankan Rupee (LKR)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="GBP">British Pound (GBP)</option>
                <option value="AUD">Australian Dollar (AUD)</option>
                <option value="CAD">Canadian Dollar (CAD)</option>
                <option value="JPY">Japanese Yen (JPY)</option>
                <option value="INR">Indian Rupee (INR)</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>Price *</label>
              <input 
                type="number"
                name="price" 
                value={form.price} 
                onChange={handleChange} 
                required 
                min="0"
                step="0.01"
                style={{ width: "100%", padding: 12, border: "2px solid #e8f5e8", borderRadius: 8, fontSize: 16 }}
                placeholder="Enter price"
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>Price Unit</label>
              <select 
                name="priceUnit" 
                value={form.priceUnit} 
                onChange={handleChange} 
                style={{ width: "100%", padding: 12, border: "2px solid #e8f5e8", borderRadius: 8, fontSize: 16, background: "white" }}
              >
                <option value="per day">Per Day</option>
                <option value="per km">Per Kilometer</option>
                <option value="per trip">Per Trip</option>
                <option value="per hour">Per Hour</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#2d5a27" }}>
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
              fontSize: "16px",
              boxSizing: "border-box",
              backgroundColor: "#f8fff8",
              cursor: "pointer"
            }}
          />
          <p style={{ fontSize: "12px", color: "#666", margin: "5px 0 0 0" }}>
            Upload high-quality images of your vehicle (JPG, PNG, WebP)
          </p>
          
          {imagePreview.length > 0 && (
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", 
              gap: "10px", 
              marginTop: "15px" 
            }}>
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
                      border: "2px solid #e8f5e8"
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
                      justifyContent: "center"
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
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
            {loading ? "Adding..." : "Add Provider"}
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

export default AddTransportProvider;
