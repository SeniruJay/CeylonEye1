import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const Accommodation = () => {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [city, setCity] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          "http://localhost:5000/api/accommodations"
        );
        setItems(data);
        setError(null);
      } catch (e) {
        setError("Failed to load accommodations");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const types = Array.from(new Set(items.map((a) => a.type)));
  const cities = Array.from(new Set(items.map((a) => a.city)));

  const filtered = useMemo(() => {
    return items.filter((a) => {
      const matchesSearch = search
        ? a.name.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchesType = type ? a.type === type : true;
      const matchesCity = city ? a.city === city : true;
      const matchesPrice = maxPrice ? a.price <= Number(maxPrice) : true;
      return matchesSearch && matchesType && matchesCity && matchesPrice;
    });
  }, [items, search, type, city, maxPrice]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?fm=jpg&q=80&w=2400&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c3JpJTIwbGFua2ElMjBob3RlbHxlbnwwfHwwfHx8MA%3D%3D')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        position: "relative",
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.55)",
          zIndex: 0,
        }}
      />

      {/* Animations */}
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(25px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .fade-section {
            animation: fadeInUp 0.9s ease forwards;
            opacity: 0;
          }
          .card-hover {
            transition: 0.3s;
            cursor: pointer;
          }
          .card-hover:hover {
            transform: translateY(-6px);
            box-shadow: 0 10px 28px rgba(0,0,0,0.25);
          }
        `}
      </style>

      {/* Main Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px 20px",
        }}
      >
        {/* Header Banner */}
        <div
          className="fade-section"
          style={{
            borderRadius: "18px",
            padding: "50px 30px",
            marginBottom: "30px",
            color: "white",
            textAlign: "center",
            background:
              "linear-gradient(135deg, rgba(128, 128, 128, 0.65), rgba(0,0,0,0.75)), url('https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500') center/cover no-repeat",
            boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "2.6rem", fontWeight: 800 }}>
            🏨 Accommodation
          </h1>
          <p style={{ marginTop: 10, fontSize: "1.2rem", opacity: 0.95 }}>
            Find your perfect stay across Sri Lanka
          </p>
        </div>

        {/* Filters */}
        <div
          className="fade-section"
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
            boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            <input
              placeholder="🔍 Search by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: 10,
                borderRadius: 8,
                border: "2px solid #e8f5e8",
                outline: "none",
              }}
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{
                padding: 10,
                borderRadius: 8,
                border: "2px solid #e8f5e8",
                background: "#fff",
              }}
            >
              <option value="">Any type</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={{
                padding: 10,
                borderRadius: 8,
                border: "2px solid #e8f5e8",
                background: "#fff",
              }}
            >
              <option value="">Any city</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              placeholder="💲 Max price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              style={{
                padding: 10,
                borderRadius: 8,
                border: "2px solid #e8f5e8",
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* Accommodation Results */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 30, color: "white" }}>
            Loading...
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: 30, color: "red" }}>
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: 30,
              background: "white",
              border: "2px dashed #4a7c59",
              borderRadius: 12,
            }}
          >
            No results. Try different filters.
          </div>
        ) : (
          <div
            className="fade-section"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 20,
            }}
          >
            {filtered.map((a) => (
              <div
                key={a.id}
                className="card-hover"
                style={{
                  background: "white",
                  borderRadius: 16,
                  padding: 20,
                  border: "1px solid #e8f5e8",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                }}
              >

                  {/* Add Image */}
  <img
    src={
      a.image
        ? `http://localhost:5000${a.image}` // ✅ prepend server URL
        : "https://images.unsplash.com/photo-1601918774946-2588f4c36de7?fm=jpg&q=80&w=1000" // fallback
    }
    alt={a.name}
    style={{
      width: "100%",
      height: 160,
      objectFit: "cover",
      borderRadius: 12,
      marginBottom: 12,
    }}
  />
                <div
                  style={{
                    fontSize: 22,
                    color: "#2d6a4f",
                    fontWeight: 700,
                  }}
                >
                  {a.name}
                </div>
                <div style={{ color: "#4a7c59", marginTop: 6 }}>
                  {a.type} • {a.city}
                </div>
                <div style={{ marginTop: 8, color: "#333" }}>
                  From ${a.price}/night • ⭐ {a.rating}
                </div>
                <button
                  onClick={() => setBooking(a)}
                  style={{
                    marginTop: 12,
                    padding: "10px 16px",
                    borderRadius: 8,
                    border: "none",
                    background: "#2d6a4f",
                    color: "#fff",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "0.3s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#1b4332")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#2d6a4f")
                  }
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Booking Modal */}
        {booking && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.55)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
              zIndex: 999,
            }}
          >
            <div
              style={{
                background: "white",
                borderRadius: 16,
                padding: 24,
                width: "100%",
                maxWidth: 520,
                boxShadow: "0 8px 28px rgba(0,0,0,0.25)",
              }}
            >
              <h3 style={{ marginTop: 0, color: "#2d6a4f" }}>
                Book {booking.name}
              </h3>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  const payload = Object.fromEntries(fd.entries());
                  try {
                    await axios.post(
                      "http://localhost:5000/api/bookings-extra/accommodation",
                      {
                        accommodationId: booking._id,
                        ...payload,
                        guests: Number(payload.guests),
                      }
                    );
                    alert("Booking created!");
                    setBooking(null);
                  } catch {
                    alert("Booking failed");
                  }
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                  }}
                >
                  <input
                    name="customerName"
                    placeholder="Full name"
                    required
                    style={{
                      padding: 10,
                      borderRadius: 8,
                      border: "2px solid #e8f5e8",
                    }}
                  />
                  <input
                    type="email"
                    name="customerEmail"
                    placeholder="Email"
                    required
                    style={{
                      padding: 10,
                      borderRadius: 8,
                      border: "2px solid #e8f5e8",
                    }}
                  />
                  <input
                    name="customerPhone"
                    placeholder="Phone"
                    required
                    style={{
                      padding: 10,
                      borderRadius: 8,
                      border: "2px solid #e8f5e8",
                    }}
                  />
                  <input
                    type="date"
                    name="checkInDate"
                    required
                    style={{
                      padding: 10,
                      borderRadius: 8,
                      border: "2px solid #e8f5e8",
                    }}
                  />
                  <input
                    type="date"
                    name="checkOutDate"
                    required
                    style={{
                      padding: 10,
                      borderRadius: 8,
                      border: "2px solid #e8f5e8",
                    }}
                  />
                  <input
                    type="number"
                    name="guests"
                    min="1"
                    defaultValue="1"
                    required
                    style={{
                      padding: 10,
                      borderRadius: 8,
                      border: "2px solid #e8f5e8",
                    }}
                  />
                </div>
                <textarea
                  name="specialRequests"
                  placeholder="Special requests"
                  rows={3}
                  style={{
                    marginTop: 10,
                    width: "100%",
                    padding: 10,
                    borderRadius: 8,
                    border: "2px solid #e8f5e8",
                  }}
                />
                <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                  <button
                    type="submit"
                    style={{
                      padding: "10px 16px",
                      background: "#2d6a4f",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setBooking(null)}
                    style={{
                      padding: "10px 16px",
                      background: "#6c757d",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        
      </div>
    </div>
  );
};

export default Accommodation;
