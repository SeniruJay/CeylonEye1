import React, { useState, useEffect } from "react";
import axios from "axios";

const LocationSelection = ({ onNext, onSkip, selectedLocations = [] }) => {
  const [locations, setLocations] = useState([]);
  const [selected, setSelected] = useState(selectedLocations);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setError("");
      const response = await axios.get("http://localhost:5000/api/locations");
      if (response.data && response.data.length > 0) {
        setLocations(response.data);
      } else {
        setError("No locations available at the moment. Please try again later.");
      }
    } catch (error) {
      console.error("Failed to fetch locations:", error);
      setError("Failed to load locations. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLocationToggle = (location) => {
    setValidationError("");
    setSelected(prev => {
      const isSelected = prev.find(loc => loc._id === location._id);
      if (isSelected) {
        return prev.filter(loc => loc._id !== location._id);
      } else {
        return [...prev, location];
      }
    });
  };

  const handleNext = () => {
    // Validation: Check if at least one location is selected
    if (selected.length === 0) {
      setValidationError("Please select at least one location to continue.");
      return;
    }
    
    // Validation: Check if too many locations are selected (optional limit)
    if (selected.length > 10) {
      setValidationError("Please select no more than 10 locations for a better experience.");
      return;
    }
    
    setValidationError("");
    onNext({ locations: selected });
  };

  // eslint-disable-next-line no-unused-vars
  const handleSkip = () => {
    onSkip();
  };

  const getLocationIcon = (type) => {
    const icons = {
      "Beach": "🏖️",
      "Hill Country": "🏔️",
      "Heritage": "🏛️",
      "Wildlife": "🦁",
      "City": "🏙️",
      "Other": "📍"
    };
    return icons[type] || "📍";
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div style={{ fontSize: "2rem", marginBottom: "20px" }}>⏳</div>
        <p style={{ color: "#4a7c59", fontSize: "1.1rem" }}>Loading locations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div style={{ fontSize: "2rem", marginBottom: "20px" }}>⚠️</div>
        <p style={{ color: "#dc3545", fontSize: "1.1rem", marginBottom: "20px" }}>{error}</p>
        <button
          onClick={fetchLocations}
          style={{
            padding: "12px 24px",
            backgroundColor: "#4a7c59",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(74, 124, 89, 0.3)",
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
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h2 style={{ color: "#2d5a27", fontSize: "2rem", marginBottom: "10px" }}>
          Choose Your Destinations
        </h2>
        <p style={{ color: "#4a7c59", fontSize: "1.1rem" }}>
          Select the places you'd like to visit in Sri Lanka
        </p>
        {validationError && (
          <div style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "12px 20px",
            borderRadius: "8px",
            marginTop: "15px",
            border: "1px solid #f5c6cb",
            fontSize: "0.9rem",
            fontWeight: "500"
          }}>
            ⚠️ {validationError}
          </div>
        )}
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
        gap: "20px",
        marginBottom: "30px"
      }}>
        {locations.map(location => (
          <div
            key={location._id}
            onClick={() => handleLocationToggle(location)}
            style={{
              border: selected.find(loc => loc._id === location._id) 
                ? "3px solid #4a7c59" 
                : "2px solid #e8f5e8",
              borderRadius: "12px",
              padding: "20px",
              cursor: "pointer",
              backgroundColor: selected.find(loc => loc._id === location._id) 
                ? "#f0f7f0" 
                : "white",
              transition: "all 0.3s ease",
              boxShadow: selected.find(loc => loc._id === location._id) 
                ? "0 4px 15px rgba(74, 124, 89, 0.2)" 
                : "0 2px 8px rgba(0, 0, 0, 0.1)"
            }}
            onMouseOver={(e) => {
              if (!selected.find(loc => loc._id === location._id)) {
                e.target.style.borderColor = "#4a7c59";
                e.target.style.transform = "translateY(-2px)";
              }
            }}
            onMouseOut={(e) => {
              if (!selected.find(loc => loc._id === location._id)) {
                e.target.style.borderColor = "#e8f5e8";
                e.target.style.transform = "translateY(0)";
              }
            }}
          >
            <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
              <div style={{ 
                fontSize: "2rem", 
                marginRight: "15px",
                backgroundColor: selected.find(loc => loc._id === location._id) 
                  ? "#4a7c59" 
                  : "#e8f5e8",
                padding: "10px",
                borderRadius: "50%",
                width: "60px",
                height: "60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                {getLocationIcon(location.type)}
              </div>
              <div>
                <h3 style={{ 
                  margin: "0 0 5px 0", 
                  color: "#2d5a27",
                  fontSize: "1.3rem"
                }}>
                  {location.name}
                </h3>
                <p style={{ 
                  margin: "0", 
                  color: "#4a7c59",
                  fontSize: "0.9rem",
                  fontWeight: "600"
                }}>
                  {location.region} • {location.type}
                </p>
              </div>
            </div>
            {location.description && (
              <p style={{ 
                color: "#666", 
                fontSize: "0.9rem",
                lineHeight: "1.4",
                margin: "0"
              }}>
                {location.description}
              </p>
            )}
            {selected.find(loc => loc._id === location._id) && (
              <div style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: "#4a7c59",
                color: "white",
                borderRadius: "50%",
                width: "25px",
                height: "25px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.8rem",
                fontWeight: "bold"
              }}>
                ✓
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        paddingTop: "20px",
        borderTop: "2px solid #f0f7f0"
      }}>
        <div style={{ color: "#4a7c59", fontSize: "1rem" }}>
          {selected.length} location{selected.length !== 1 ? 's' : ''} selected
          {selected.length === 0 && (
            <span style={{ color: "#dc3545", marginLeft: "10px", fontSize: "0.9rem" }}>
              (Minimum 1 required)
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleSkip}
            style={{
              padding: "15px 30px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(108, 117, 125, 0.3)",
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
            Skip This Step
          </button>
          <button
            onClick={handleNext}
            disabled={selected.length === 0}
            style={{
              padding: "15px 30px",
              backgroundColor: selected.length === 0 ? "#6c757d" : "#4a7c59",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: selected.length === 0 ? "not-allowed" : "pointer",
              boxShadow: selected.length === 0 ? "0 2px 6px rgba(108, 117, 125, 0.2)" : "0 4px 12px rgba(74, 124, 89, 0.3)",
              transition: "all 0.3s ease",
              opacity: selected.length === 0 ? 0.6 : 1
            }}
            onMouseOver={(e) => {
              if (selected.length > 0) {
                e.target.style.backgroundColor = "#3d6b4a";
                e.target.style.transform = "translateY(-2px)";
              }
            }}
            onMouseOut={(e) => {
              if (selected.length > 0) {
                e.target.style.backgroundColor = "#4a7c59";
                e.target.style.transform = "translateY(0)";
              }
            }}
          >
            {selected.length === 0 ? "Select at least 1 location" : "Next: Transport Selection →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationSelection;
