import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Homepage = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("fade-in-up");
        });
      },
      { threshold: 0.2 }
    );
    document.querySelectorAll(".scroll-animate").forEach((el) => {
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ margin: 0, padding: 0 }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up { animation: fadeUp 1s ease forwards; }
        
        .hero-section {
          position: relative;
          height: 100vh;
          background: #000000;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        
        .hero-content {
          text-align: center;
          color: white;
          z-index: 2;
          position: relative;
        }
        
        .hero-title {
          font-size: 4rem;
          font-weight: 300;
          margin: 0 0 20px 0;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          letter-spacing: 2px;
        }
        
        .hero-subtitle {
          font-size: 1.5rem;
          font-weight: 300;
          margin: 0;
          opacity: 0.9;
          letter-spacing: 1px;
        }
        
        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url('https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80');
          background-size: cover;
          background-position: center;
          opacity: 0.4;
          z-index: 1;
          animation: slideShow 20s infinite;
        }
        
        @keyframes slideShow {
          0% { background-image: url('https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'); }
          25% { background-image: url('https://images.unsplash.com/photo-1539576776193-2c07122e5fee?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1171'); }
          50% { background-image: url('https://images.unsplash.com/photo-1641482067662-e7d40548bf12?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170'); }
          75% { background-image: url('https://fos.cmb.ac.lk/blog/wp-content/uploads/2021/06/Featured-Image-3-e1629564214632.jpg'); }
          100% { background-image: url('https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'); }
        }
        
        .navigation-arrows {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 3;
        }
        
        .nav-arrow {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          color: white;
          font-size: 20px;
        }
        
        .nav-arrow:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
        }
        
        .nav-arrow.left {
          left: 30px;
        }
        
        .nav-arrow.right {
          right: 30px;
        }
      `}</style>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-background"></div>
        
        {/* Navigation Arrows */}
        <div className="navigation-arrows nav-arrow left">
          ‹
        </div>
        <div className="navigation-arrows nav-arrow right">
          ›
        </div>
        
        {/* Hero Content */}
        <div className="hero-content">
          <h1 className="hero-title"><b>CeylonEye</b></h1>
          <p className="hero-subtitle">Walk the island's untold paths</p>
        </div>
      </div>

      {/* Scrollable Content Sections */}
      <div style={{ backgroundColor: "#ffffff", padding: "80px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
          
          {/* Popular Destinations Section */}
          <div className="scroll-animate" style={{ marginBottom: "80px", textAlign: "center" }}>
            <h2 style={{ 
              fontSize: "2.5rem", 
              fontWeight: "300", 
              color: "#333", 
              marginBottom: "20px",
              letterSpacing: "1px"
            }}>
              Popular Destinations
            </h2>
            <p style={{ 
              fontSize: "1.1rem", 
              color: "#666", 
              marginBottom: "50px",
              maxWidth: "600px",
              margin: "0 auto 50px auto"
            }}>
              Discover breathtaking locations that will create memories to last a lifetime
            </p>
            
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "30px",
              marginTop: "40px"
            }}>
              {[
                {
                  img: "https://images.unsplash.com/photo-1548957175-84f0f9af659e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1182",
                  title: "Mountain Adventures",
                  description: "Experience breathtaking peaks and serene valleys"
                },
                {
                  img: "https://images.unsplash.com/photo-1613693699413-7dde0260f437?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1169",
                  title: "Tropical Beaches",
                  description: "Relax on pristine shores with crystal clear waters"
                },
                {
                  img: "https://images.unsplash.com/photo-1559038300-2c1c9d6d7d5f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
                  title: "Forest Retreats",
                  description: "Immerse yourself in nature's tranquil embrace"
                }
              ].map((destination, index) => (
                <div key={index} style={{
                  borderRadius: "15px",
                  overflow: "hidden",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  backgroundColor: "white"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
                }}>
                  <img 
                    src={destination.img} 
                    alt={destination.title}
                    style={{ width: "100%", height: "200px", objectFit: "cover" }}
                  />
                  <div style={{ padding: "25px" }}>
                    <h3 style={{ 
                      fontSize: "1.3rem", 
                      fontWeight: "600", 
                      color: "#333", 
                      marginBottom: "10px" 
                    }}>
                      {destination.title}
                    </h3>
                    <p style={{ 
                      color: "#666", 
                      lineHeight: "1.6",
                      margin: 0
                    }}>
                      {destination.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Travel Experiences Section */}
          <div className="scroll-animate" style={{ marginBottom: "80px", textAlign: "center" }}>
            <h2 style={{ 
              fontSize: "2.5rem", 
              fontWeight: "300", 
              color: "#333", 
              marginBottom: "20px",
              letterSpacing: "1px"
            }}>
              Unique Travel Experiences
            </h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "30px",
              marginTop: "40px"
            }}>
              {[
                { icon: "🏔️", title: "Adventure Tours", description: "Thrilling experiences in nature" },
                { icon: "🏛️", title: "Cultural Heritage", description: "Explore ancient traditions and history" },
                { icon: "🍽️", title: "Culinary Journeys", description: "Taste authentic local cuisines" },
                { icon: "🧘", title: "Wellness Retreats", description: "Rejuvenate your mind and body" }
              ].map((experience, index) => (
                <div key={index} style={{
                  padding: "40px 20px",
                  backgroundColor: "white",
                  borderRadius: "15px",
                  boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
                  transition: "transform 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}>
                  <div style={{ fontSize: "3rem", marginBottom: "20px" }}>{experience.icon}</div>
                  <h3 style={{ 
                    fontSize: "1.2rem", 
                    fontWeight: "600", 
                    color: "#333", 
                    marginBottom: "15px" 
                  }}>
                    {experience.title}
                  </h3>
                  <p style={{ color: "#666", lineHeight: "1.6", margin: 0 }}>
                    {experience.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="scroll-animate" style={{ textAlign: "center" }}>
            <h2 style={{ 
              fontSize: "2.5rem", 
              fontWeight: "300", 
              color: "#333", 
              marginBottom: "50px",
              letterSpacing: "1px"
            }}>
              What Our Travelers Say
            </h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "30px"
            }}>
              {[
                {
                  name: "Sarah Johnson",
                  location: "New York, USA",
                  text: "An absolutely magical experience! The attention to detail and personalized service made our trip unforgettable.",
                  rating: "★★★★★"
                },
                {
                  name: "Michael Chen",
                  location: "Toronto, Canada", 
                  text: "Professional, reliable, and truly passionate about creating amazing travel experiences. Highly recommended!",
                  rating: "★★★★★"
                },
                {
                  name: "Emma Wilson",
                  location: "London, UK",
                  text: "From planning to execution, everything was perfect. They turned our dream vacation into reality.",
                  rating: "★★★★★"
                }
              ].map((testimonial, index) => (
                <div key={index} style={{
                  backgroundColor: "white",
                  padding: "30px",
                  borderRadius: "15px",
                  boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
                  textAlign: "left"
                }}>
                  <div style={{ 
                    color: "#ffd700", 
                    fontSize: "1.2rem", 
                    marginBottom: "15px" 
                  }}>
                    {testimonial.rating}
                  </div>
                  <p style={{ 
                    color: "#666", 
                    lineHeight: "1.6", 
                    marginBottom: "20px",
                    fontStyle: "italic"
                  }}>
                    "{testimonial.text}"
                  </p>
                  <div>
                    <div style={{ 
                      fontWeight: "600", 
                      color: "#333", 
                      marginBottom: "5px" 
                    }}>
                      {testimonial.name}
                    </div>
                    <div style={{ color: "#999", fontSize: "0.9rem" }}>
                      {testimonial.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
