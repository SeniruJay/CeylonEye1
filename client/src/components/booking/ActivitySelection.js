import React, { useState, useEffect } from "react";
import axios from "axios";

const ActivitySelection = ({ onNext, onSkip, onBack, selectedActivities = [] }) => {
  const [activities, setActivities] = useState([]);
  const [selected, setSelected] = useState(selectedActivities);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/activities");
      setActivities(response.data);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleActivityToggle = (activity) => {
    setSelected(prev => {
      const isSelected = prev.find(act => act._id === activity._id);
      if (isSelected) {
        return prev.filter(act => act._id !== activity._id);
      } else {
        return [...prev, activity];
      }
    });
  };

  const handleNext = () => {
    onNext({ activities: selected });
  };

  // eslint-disable-next-line no-unused-vars
  const handleSkip = () => {
    onSkip();
  };

  const getActivityIcon = (category) => {
    const icons = {
      "Wildlife": "🦁",
      "Water Sports": "🏄‍♂️",
      "Heritage": "🏛️",
      "Adventure": "🧗‍♂️",
      "Other": "🎯"
    };
    return icons[category] || "🎯";
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

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div style={{ fontSize: "2rem", marginBottom: "20px" }}>⏳</div>
        <p style={{ color: "#4a7c59", fontSize: "1.1rem" }}>Loading activities...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h2 style={{ color: "#2d5a27", fontSize: "2rem", marginBottom: "10px" }}>
          Choose Your Activities
        </h2>
        <p style={{ color: "#4a7c59", fontSize: "1.1rem" }}>
          Select the leisure activities you'd like to experience
        </p>
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", 
        gap: "20px",
        marginBottom: "30px"
      }}>
        {activities.map(activity => (
          <div
            key={activity._id}
            onClick={() => handleActivityToggle(activity)}
            style={{
              border: selected.find(act => act._id === activity._id) 
                ? "3px solid #4a7c59" 
                : "2px solid #e8f5e8",
              borderRadius: "12px",
              padding: "25px",
              cursor: "pointer",
              backgroundColor: selected.find(act => act._id === activity._id) 
                ? "#f0f7f0" 
                : "white",
              transition: "all 0.3s ease",
              boxShadow: selected.find(act => act._id === activity._id) 
                ? "0 4px 15px rgba(74, 124, 89, 0.2)" 
                : "0 2px 8px rgba(0, 0, 0, 0.1)",
              position: "relative"
            }}
            onMouseOver={(e) => {
              if (!selected.find(act => act._id === activity._id)) {
                e.target.style.borderColor = "#4a7c59";
                e.target.style.transform = "translateY(-2px)";
              }
            }}
            onMouseOut={(e) => {
              if (!selected.find(act => act._id === activity._id)) {
                e.target.style.borderColor = "#e8f5e8";
                e.target.style.transform = "translateY(0)";
              }
            }}
          >
            <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
              <div style={{ 
                fontSize: "2.5rem", 
                marginRight: "20px",
                backgroundColor: selected.find(act => act._id === activity._id) 
                  ? "#4a7c59" 
                  : "#e8f5e8",
                padding: "15px",
                borderRadius: "50%",
                width: "70px",
                height: "70px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                {getActivityIcon(activity.category)}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ 
                  margin: "0 0 5px 0", 
                  color: "#2d5a27",
                  fontSize: "1.4rem"
                }}>
                  {activity.name}
                </h3>
                <p style={{ 
                  margin: "0 0 8px 0", 
                  color: "#4a7c59",
                  fontSize: "1rem",
                  fontWeight: "600"
                }}>
                  {activity.category} • {activity.location}
                </p>
                {activity.duration && (
                  <p style={{ 
                    margin: "0 0 8px 0", 
                    color: "#666",
                    fontSize: "0.9rem"
                  }}>
                    Duration: {activity.duration}
                  </p>
                )}
                <p style={{ 
                  margin: "0", 
                  color: "#2d5a27",
                  fontSize: "1.2rem",
                  fontWeight: "bold"
                }}>
                  {activity.price > 0 ? `${getCurrencySymbol()}$${activity.price}` : "Free"}
                </p>
              </div>
            </div>

            {activity.description && (
              <p style={{ 
                color: "#666", 
                fontSize: "0.9rem",
                lineHeight: "1.4",
                margin: "0 0 15px 0"
              }}>
                {activity.description}
              </p>
            )}

            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              fontSize: "0.9rem",
              color: "#4a7c59"
            }}>
              <span>Location: {activity.location}</span>
              <span style={{ 
                backgroundColor: activity.availability ? "#d4edda" : "#f8d7da",
                color: activity.availability ? "#155724" : "#721c24",
                padding: "4px 8px",
                borderRadius: "12px",
                fontSize: "0.8rem",
                fontWeight: "600"
              }}>
                {activity.availability ? "Available" : "Unavailable"}
              </span>
            </div>

            {selected.find(act => act._id === activity._id) && (
              <div style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                backgroundColor: "#4a7c59",
                color: "white",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
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
        <button
          onClick={onBack}
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
          ← Back to Accommodation
        </button>

        <div style={{ color: "#4a7c59", fontSize: "1rem" }}>
          {selected.length} activit{selected.length !== 1 ? 'ies' : 'y'} selected
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
            Next: Payment →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivitySelection;
