import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const TransportList = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const deleteProvider = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/transport-providers/${id}`);
        setProviders(providers.filter(p => p._id !== id));
        alert("Transport provider deleted successfully!");
      } catch (err) {
        alert("Failed to delete transport provider. Please try again.");
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h2>Loading transport providers...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={fetchProviders} style={{ padding: "10px 20px", marginTop: "10px" }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>Registered Transport Providers</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link 
            to="/admin/users" 
            style={{
              backgroundColor: "#6c757d",
              color: "white",
              padding: "12px 24px",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              boxShadow: "0 2px 4px rgba(108, 117, 125, 0.3)",
              transition: "all 0.3s ease"
            }}
          >
            👥 Manage Users
          </Link>
          <Link 
            to="/admin/add" 
            style={{
            backgroundColor: "#4a7c59",
            color: "white",
            padding: "12px 24px",
            textDecoration: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            boxShadow: "0 2px 4px rgba(74, 124, 89, 0.3)",
            transition: "all 0.3s ease"
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#3d6b4a";
            e.target.style.transform = "translateY(-2px)";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "#4a7c59";
            e.target.style.transform = "translateY(0)";
          }}
        >
          + Add New Provider
        </Link>
        </div>
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
          <h3 style={{ color: "#4a7c59", marginBottom: "10px" }}>No transport providers found</h3>
          <p style={{ color: "#666" }}>Click "Add New Provider" to get started.</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ 
            width: "100%", 
            borderCollapse: "collapse", 
            backgroundColor: "white",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            borderRadius: "8px",
            overflow: "hidden"
          }}>
            <thead>
              <tr style={{ backgroundColor: "#f0f7f0" }}>
                <th style={{ padding: "15px", textAlign: "left", borderBottom: "2px solid #4a7c59", color: "#2d5a27", fontWeight: "600" }}>Name</th>
                <th style={{ padding: "15px", textAlign: "left", borderBottom: "2px solid #4a7c59", color: "#2d5a27", fontWeight: "600" }}>Contact</th>
                <th style={{ padding: "15px", textAlign: "left", borderBottom: "2px solid #4a7c59", color: "#2d5a27", fontWeight: "600" }}>Vehicle Type</th>
                <th style={{ padding: "15px", textAlign: "left", borderBottom: "2px solid #4a7c59", color: "#2d5a27", fontWeight: "600" }}>Availability</th>
                <th style={{ padding: "15px", textAlign: "center", borderBottom: "2px solid #4a7c59", color: "#2d5a27", fontWeight: "600" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {providers.map(provider => (
                <tr key={provider._id} style={{ borderBottom: "1px solid #dee2e6" }}>
                  <td style={{ padding: "15px", fontWeight: "500" }}>{provider.name}</td>
                  <td style={{ padding: "15px" }}>{provider.contact}</td>
                  <td style={{ padding: "15px" }}>{provider.vehicleType}</td>
                  <td style={{ padding: "15px" }}>
                    <span style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      backgroundColor: provider.availability ? "#d4edda" : "#f8d7da",
                      color: provider.availability ? "#2d5a27" : "#721c24",
                      border: provider.availability ? "1px solid #4a7c59" : "1px solid #dc3545"
                    }}>
                      {provider.availability ? "Available" : "Not Available"}
                    </span>
                  </td>
                  <td style={{ padding: "15px", textAlign: "center" }}>
                    <Link 
                      to={`/admin/edit/${provider._id}`}
                      style={{
                        backgroundColor: "#4a7c59",
                        color: "white",
                        padding: "8px 16px",
                        textDecoration: "none",
                        borderRadius: "6px",
                        marginRight: "8px",
                        fontSize: "14px",
                        fontWeight: "500",
                        boxShadow: "0 2px 4px rgba(74, 124, 89, 0.3)",
                        transition: "all 0.3s ease"
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = "#3d6b4a";
                        e.target.style.transform = "translateY(-1px)";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = "#4a7c59";
                        e.target.style.transform = "translateY(0)";
                      }}
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => deleteProvider(provider._id, provider.name)}
                      style={{
                        backgroundColor: "#dc3545",
                        color: "white",
                        padding: "8px 16px",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "500",
                        boxShadow: "0 2px 4px rgba(220, 53, 69, 0.3)",
                        transition: "all 0.3s ease"
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = "#c82333";
                        e.target.style.transform = "translateY(-1px)";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = "#dc3545";
                        e.target.style.transform = "translateY(0)";
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransportList;
