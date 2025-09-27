import React from "react";

const ConfirmationPopup = ({ onClose }) => {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "20px"
    }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: "15px",
        padding: "40px",
        width: "100%",
        maxWidth: "500px",
        textAlign: "center",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
        animation: "slideIn 0.3s ease-out"
      }}>
        <div style={{
          fontSize: "4rem",
          marginBottom: "20px",
          color: "#4a7c59"
        }}>
          ✅
        </div>
        
        <h2 style={{
          color: "#2d5a27",
          fontSize: "1.8rem",
          marginBottom: "15px",
          fontWeight: "bold"
        }}>
          Booking Submitted Successfully!
        </h2>
        
        <p style={{
          color: "#4a7c59",
          fontSize: "1.1rem",
          lineHeight: "1.5",
          marginBottom: "30px"
        }}>
          Your booking has been successfully submitted for review.
        </p>
        
        <div style={{
          backgroundColor: "#f0f7f0",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "30px",
          border: "1px solid #e8f5e8"
        }}>
          <h3 style={{
            color: "#2d5a27",
            fontSize: "1.1rem",
            marginBottom: "10px",
            fontWeight: "600"
          }}>
            What happens next?
          </h3>
          <ul style={{
            color: "#4a7c59",
            fontSize: "0.9rem",
            textAlign: "left",
            margin: 0,
            paddingLeft: "20px"
          }}>
            <li style={{ marginBottom: "5px" }}>Our team will review your booking</li>
            <li style={{ marginBottom: "5px" }}>You'll receive a confirmation email within 24 hours</li>
            <li style={{ marginBottom: "5px" }}>Payment will be processed upon confirmation</li>
            <li>Detailed itinerary will be sent to your email</li>
          </ul>
        </div>
        
        <button
          onClick={onClose}
          style={{
            padding: "15px 40px",
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
          Continue Planning
        </button>
      </div>
      
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ConfirmationPopup;
