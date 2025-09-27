import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const Activities = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(null);

  useEffect(()=>{ (async ()=>{
    try { setLoading(true); const { data } = await axios.get('http://localhost:5000/api/activities'); setItems(data); setError(null); }
    catch (e) { setError('Failed to load activities'); }
    finally { setLoading(false); }
  })(); }, []);

  const categories = Array.from(new Set(items.map(a => a.category)));
  const locations = Array.from(new Set(items.map(a => a.location)));

  const filtered = useMemo(() => {
    return items.filter(a => {
      const s = search ? a.name.toLowerCase().includes(search.toLowerCase()) : true;
      const c = category ? a.category === category : true;
      const l = location ? a.location === location : true;
      return s && c && l;
    });
  }, [items, search, category, location]);

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{
        borderRadius: 18,
        padding: "40px 24px",
        marginBottom: 20,
        color: "white",
        background: "linear-gradient(135deg, rgba(0,0,0,0.45), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1539136788836-5699e78bfc75?q=80&w=1400&auto=format&fit=crop') center/cover no-repeat",
        boxShadow: "0 12px 32px rgba(0,0,0,0.2)"
      }}>
        <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: 800 }}>Leisure Activities</h1>
        <p style={{ marginTop: 6, marginBottom: 0, opacity: 0.95 }}>Find fun things to do</p>
      </div>

      <div style={{ background: "white", border: "1px solid #e8f5e8", borderRadius: 12, padding: 16, boxShadow: "0 6px 16px rgba(0,0,0,0.06)", marginBottom: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          <input placeholder="Search activity" value={search} onChange={(e)=>setSearch(e.target.value)} style={{ padding: 10, borderRadius: 8, border: "2px solid #e8f5e8" }} />
          <select value={category} onChange={(e)=>setCategory(e.target.value)} style={{ padding: 10, borderRadius: 8, border: "2px solid #e8f5e8", background: "#fff" }}>
            <option value="">Any category</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={location} onChange={(e)=>setLocation(e.target.value)} style={{ padding: 10, borderRadius: 8, border: "2px solid #e8f5e8", background: "#fff" }}>
            <option value="">Any location</option>
            {locations.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 30 }}>Loading...</div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: 30, color: 'red' }}>{error}</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 30, background: "white", border: "2px dashed #4a7c59", borderRadius: 12 }}>No results. Try different filters.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {filtered.map(a => (
            <div key={a._id} style={{ background: "white", borderRadius: 12, padding: 16, border: "1px solid #e8f5e8", boxShadow: "0 6px 16px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 20, color: "#2d5a27", fontWeight: 700 }}>{a.name}</div>
              <div style={{ color: "#4a7c59", marginTop: 4 }}>{a.category} • {a.location}</div>
              <div style={{ marginTop: 8, color: "#333" }}>{a.duration}</div>
              <button onClick={()=>setBooking(a)} style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, border: "none", background: "#4a7c59", color: "#fff", fontWeight: 700 }}>Book</button>
            </div>
          ))}
        </div>
      )}
      {booking && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'white', borderRadius: 12, padding: 20, width: '100%', maxWidth: 520 }}>
            <h3 style={{ marginTop: 0, color: '#2d5a27' }}>Book {booking.name}</h3>
            <form onSubmit={async (e)=>{ e.preventDefault(); const fd = new FormData(e.currentTarget); const payload = Object.fromEntries(fd.entries()); try { await axios.post('http://localhost:5000/api/bookings-extra/activity', { activityId: booking._id, customerName: payload.customerName, customerEmail: payload.customerEmail, customerPhone: payload.customerPhone, scheduledDate: payload.scheduledDate, participants: Number(payload.participants), specialRequests: payload.specialRequests }); alert('Booking created!'); setBooking(null); } catch { alert('Booking failed'); } }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <input name="customerName" placeholder="Full name" required style={{ padding: 10, borderRadius: 8, border: '2px solid #e8f5e8' }} />
                <input type="email" name="customerEmail" placeholder="Email" required style={{ padding: 10, borderRadius: 8, border: '2px solid #e8f5e8' }} />
                <input name="customerPhone" placeholder="Phone" required style={{ padding: 10, borderRadius: 8, border: '2px solid #e8f5e8' }} />
                <input type="date" name="scheduledDate" required style={{ padding: 10, borderRadius: 8, border: '2px solid #e8f5e8' }} />
                <input type="number" name="participants" min="1" defaultValue="1" required style={{ padding: 10, borderRadius: 8, border: '2px solid #e8f5e8' }} />
              </div>
              <textarea name="specialRequests" placeholder="Special requests" rows={3} style={{ marginTop: 10, width: '100%', padding: 10, borderRadius: 8, border: '2px solid #e8f5e8' }} />
              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <button type="submit" style={{ padding: '10px 16px', background: '#4a7c59', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700 }}>Confirm</button>
                <button type="button" onClick={()=>setBooking(null)} style={{ padding: '10px 16px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activities;


