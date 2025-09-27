import React, { useState } from "react";
import axios from "axios";
import LocationSelection from "./booking/LocationSelection";
import TransportSelection from "./booking/TransportSelection";
import AccommodationSelection from "./booking/AccommodationSelection";
import ActivitySelection from "./booking/ActivitySelection";
import PaymentStep from "./booking/PaymentStep";
import ConfirmationPopup from "./booking/ConfirmationPopup";

const BookingFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    locations: [],
    transport: null,
    accommodations: [],
    activities: [],
    payment: {
      name: "",
      email: "",
      phone: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      billingAddress: ""
    }
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);

  const steps = [
    { id: 1, title: "Location Selection", icon: "📍" },
    { id: 2, title: "Transport Selection", icon: "🚗" },
    { id: 3, title: "Accommodation Selection", icon: "🏨" },
    { id: 4, title: "Leisure Activities", icon: "🎯" },
    { id: 5, title: "Payment", icon: "💳" }
  ];

  const handleNext = (stepData) => {
    setBookingData(prev => ({ ...prev, ...stepData }));
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBookingSubmit = async (paymentData) => {
    setLoading(true);
    try {
      const finalBookingData = {
        ...bookingData,
        payment: paymentData,
        userId: JSON.parse(localStorage.getItem("user"))?._id,
        bookingDate: new Date().toISOString(),
        status: "pending"
      };

      // Submit booking to backend
      await axios.post("http://localhost:5000/api/bookings/comprehensive", finalBookingData);
      
      setShowConfirmation(true);
      setCurrentStep(1); // Reset to first step
      setBookingData({
        locations: [],
        transport: null,
        accommodations: [],
        activities: [],
        payment: {
          name: "",
          email: "",
          phone: "",
          cardNumber: "",
          expiryDate: "",
          cvv: "",
          billingAddress: ""
        }
      });
    } catch (error) {
      console.error("Booking submission failed:", error);
      alert("Failed to submit booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <LocationSelection onNext={handleNext} onSkip={handleSkip} selectedLocations={bookingData.locations} />;
      case 2:
        return <TransportSelection onNext={handleNext} onSkip={handleSkip} onBack={handleBack} selectedTransport={bookingData.transport} />;
      case 3:
        return <AccommodationSelection onNext={handleNext} onSkip={handleSkip} onBack={handleBack} selectedAccommodations={bookingData.accommodations} />;
      case 4:
        return <ActivitySelection onNext={handleNext} onSkip={handleSkip} onBack={handleBack} selectedActivities={bookingData.activities} />;
      case 5:
        return <PaymentStep onBack={handleBack} onSubmit={handleBookingSubmit} bookingData={bookingData} loading={loading} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#f8fff8",
      padding: "20px 0"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ 
            color: "#2d5a27", 
            fontSize: "2.5rem", 
            marginBottom: "10px",
            fontWeight: "bold"
          }}>
            Plan Your Sri Lankan Adventure
          </h1>
          <p style={{ 
            color: "#4a7c59", 
            fontSize: "1.1rem",
            margin: 0
          }}>
            Follow these simple steps to create your perfect itinerary
          </p>
        </div>

        {/* Progress Steps */}
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          marginBottom: "40px",
          flexWrap: "wrap",
          gap: "10px"
        }}>
          {steps.map((step, index) => (
            <div key={step.id} style={{ 
              display: "flex", 
              alignItems: "center",
              flexDirection: "column",
              minWidth: "120px"
            }}>
              <div style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                backgroundColor: currentStep >= step.id ? "#4a7c59" : "#e8f5e8",
                color: currentStep >= step.id ? "white" : "#4a7c59",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
                fontWeight: "bold",
                marginBottom: "8px",
                transition: "all 0.3s ease"
              }}>
                {currentStep > step.id ? "✓" : step.id}
              </div>
              <span style={{
                fontSize: "0.9rem",
                fontWeight: "600",
                color: currentStep >= step.id ? "#2d5a27" : "#6c757d",
                textAlign: "center"
              }}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div style={{
                  width: "40px",
                  height: "2px",
                  backgroundColor: currentStep > step.id ? "#4a7c59" : "#e8f5e8",
                  marginTop: "-25px",
                  marginLeft: "60px",
                  zIndex: -1
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "15px",
          padding: "40px",
          boxShadow: "0 8px 25px rgba(45, 90, 39, 0.1)",
          border: "1px solid #e8f5e8"
        }}>
          {renderStep()}
        </div>
      </div>

      {/* Confirmation Popup */}
      {showConfirmation && (
        <ConfirmationPopup onClose={() => setShowConfirmation(false)} />
      )}
    </div>
  );
};

export default BookingFlow;
