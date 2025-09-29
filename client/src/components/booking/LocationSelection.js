import React, { useState, useEffect } from "react";
import axios from "axios";

const LocationSelection = ({ onNext, onSkip, selectedLocations = [] }) => {
  const [locations, setLocations] = useState([]);
  const [selected, setSelected] = useState(selectedLocations);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/locations");
      setLocations(response.data);
    } catch (error) {
      console.error("Failed to fetch locations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationToggle = (location) => {
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

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h2 style={{ color: "#2d5a27", fontSize: "2rem", marginBottom: "10px" }}>
          Choose Your Destinations
        </h2>
        <p style={{ color: "#4a7c59", fontSize: "1.1rem" }}>
          Select the places you'd like to visit in Sri Lanka
        </p>
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
            style={{
              padding: "15px 30px",
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
            Next: Transport Selection →
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationSelection;
