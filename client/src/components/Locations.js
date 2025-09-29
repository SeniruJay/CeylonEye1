import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const Locations = () => {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [type, setType] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(null); // store selected card for booking modal

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("http://localhost:5000/api/locations");
        setItems(data);
        setError(null);
      } catch (e) {
        setError("Failed to load locations");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const regions = Array.from(new Set(items.map((l) => l.region)));
  const types = Array.from(new Set(items.map((l) => l.type)));

  const filtered = useMemo(() => {
    return items.filter((l) => {
      const s = search
        ? l.name.toLowerCase().includes(search.toLowerCase())
        : true;
      const r = region ? l.region === region : true;
      const t = type ? l.type === type : true;
      return s && r && t;
    });
  }, [items, search, region, type]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://holidayssrilanka.com/wp-content/uploads/2019/02/3-145.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        position: "relative",
      }}
    >
      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.55)",
          zIndex: 0,
        }}
      />

      <style>
        {`
          .card-hover { transition: 0.3s; }
          .card-hover:hover { transform: translateY(-6px); box-shadow: 0 12px 28px rgba(0,0,0,0.25); }

          /* Modal animations */
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { transform: translateY(40px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .modal-backdrop {
            animation: fadeIn 0.3s ease forwards;
          }
          .modal-card {
            animation: slideUp 0.4s ease forwards;
          }
        `}
      </style>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px 20px",
        }}
      >
        {/* Banner */}
        <div
          style={{
            borderRadius: "18px",
            padding: "50px 30px",
            marginBottom: "30px",
            color: "white",
            textAlign: "center",
            background:
              "linear-gradient(135deg, rgba(81, 81, 81, 0.65), rgba(135, 67, 2, 0.59)), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?fm=jpg&q=60&w=2000') center/cover no-repeat",
            boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "2.6rem", fontWeight: 800 }}>
            🌍 Explore Locations
          </h1>
          <p style={{ marginTop: 10, fontSize: "1.2rem", opacity: 0.95 }}>
            Discover Sri Lanka’s most iconic destinations
          </p>
        </div>

        {/* Filters */}
        <div
          style={{
            background: "rgba(255,255,255,0.97)",
            borderRadius: 16,
            padding: 20,
            marginBottom: 30,
            boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
          }}
        >
          <h3 style={{ margin: "0 0 12px 0", color: "#2d6a4f" }}>
            🔎 Refine your search
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 15,
            }}
          >
            <input
              placeholder="Search location"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: 12,
                borderRadius: 8,
                border: "2px solid #e8f5e8",
                outline: "none",
              }}
            />
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              style={{
                padding: 12,
                borderRadius: 8,
                border: "2px solid #e8f5e8",
                background: "#fff",
              }}
            >
              <option value="">Any region</option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{
                padding: 12,
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
          </div>
        </div>

        {/* Results */}
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
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {filtered.map((l) => (
              <div
                key={l._id}
                className="card-hover"
                style={{
                  background: "white",
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "1px solid #e8f5e8",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                }}
              >
                <img
  src={
    l.image
      ? `http://localhost:5000${l.image}` // ✅ prepend API server
      : "https://images.unsplash.com/photo-1601918774946-2588f4c36de7?fm=jpg&q=80&w=1000"
  }
  alt={l.name}
  style={{ width: "100%", height: 160, objectFit: "cover" }}
/>

                <div style={{ padding: 16 }}>
                  <div
                    style={{
                      fontSize: 20,
                      color: "#2d6a4f",
                      fontWeight: 700,
                    }}
                  >
                    {l.name}
                  </div>
                  <div style={{ color: "#4a7c59", marginTop: 6 }}>
                    {l.region} • {l.type}
                  </div>
                  <button
                    onClick={() => setBooking(l)}
                    style={{
                      marginTop: 12,
                      width: "100%",
                      padding: "10px 16px",
                      borderRadius: 8,
                      border: "none",
                      background: "#2d6a4f",
                      color: "#fff",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Book Visit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Booking Modal */}
        {booking && (
          <div
            className="modal-backdrop"
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(3px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
              zIndex: 999,
            }}
          >
            <div
              className="modal-card"
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
                      "http://localhost:5000/api/bookings-extra/location",
                      {
                        locationId: booking._id,
                        ...payload,
                        groupSize: Number(payload.groupSize),
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
                    name="visitDate"
                    required
                    style={{
                      padding: 10,
                      borderRadius: 8,
                      border: "2px solid #e8f5e8",
                    }}
                  />
                  <input
                    type="number"
                    name="groupSize"
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
                      flex: 1,
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
                      flex: 1,
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

export default Locations;
