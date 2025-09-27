import React, { useEffect, useState } from "react";
import axios from "axios";

const empty = { name: "", type: "Hotel", city: "", price: 0, rating: 0, availability: true };

const AdminAccommodations = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    try { setLoading(true); const { data } = await axios.get("http://localhost:5000/api/accommodations"); setItems(data); setError(null); }
    catch (e) { setError("Failed to load"); } finally { setLoading(false); }
  };
  useEffect(()=>{ load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/accommodations/${editingId}`, form);
      } else {
        await axios.post("http://localhost:5000/api/accommodations", form);
      }
      setForm(empty); setEditingId(null); load();
    } catch (e) { alert("Save failed"); }
  };

  const edit = (it) => { setEditingId(it._id); setForm({ name: it.name, type: it.type, city: it.city, price: it.price, rating: it.rating, availability: it.availability }); };
  const del = async (id) => { if (!window.confirm("Delete item?")) return; await axios.delete(`http://localhost:5000/api/accommodations/${id}`); load(); };

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (error) return <div style={{ padding: 20, color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ color: '#2d5a27' }}>Manage Accommodation</h2>
      <form onSubmit={submit} style={{ background: 'white', border: '1px solid #e8f5e8', borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
          <div>
            <label style={{ display: 'block', fontWeight: 700, color: '#2d5a27', marginBottom: 6 }}>Accommodation name</label>
            <input placeholder="e.g., Galle Beach Villa" value={form.name} onChange={(e)=>setForm({ ...form, name: e.target.value })} required style={{ width: '100%', padding: 10, borderRadius: 8, border: '2px solid #e8f5e8' }} />
          </div>
          <select value={form.type} onChange={(e)=>setForm({ ...form, type: e.target.value })} style={{ padding: 10, borderRadius: 8, border: '2px solid #e8f5e8', background: '#fff' }}>
            {['Hotel','Villa','Homestay','Hostel','Resort','Other'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <div>
            <label style={{ display: 'block', fontWeight: 700, color: '#2d5a27', marginBottom: 6 }}>City</label>
            <input placeholder="e.g., Galle" value={form.city} onChange={(e)=>setForm({ ...form, city: e.target.value })} required style={{ width: '100%', padding: 10, borderRadius: 8, border: '2px solid #e8f5e8' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 700, color: '#2d5a27', marginBottom: 6 }}>Price per room/night (USD)</label>
            <input type="number" placeholder="e.g., 120" value={form.price} onChange={(e)=>setForm({ ...form, price: Number(e.target.value) })} required style={{ width: '100%', padding: 10, borderRadius: 8, border: '2px solid #e8f5e8' }} />
            <small style={{ color: '#6c757d' }}>Specify the base rate per room per night.</small>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 700, color: '#2d5a27', marginBottom: 6 }}>Rating (0–5)</label>
            <input type="number" step="0.1" placeholder="e.g., 4.5" value={form.rating} onChange={(e)=>setForm({ ...form, rating: Number(e.target.value) })} style={{ width: '100%', padding: 10, borderRadius: 8, border: '2px solid #e8f5e8' }} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type="checkbox" checked={form.availability} onChange={(e)=>setForm({ ...form, availability: e.target.checked })} /> Available
          </label>
        </div>
        <div style={{ marginTop: 12 }}>
          <button type="submit" style={{ padding: '10px 16px', background: '#4a7c59', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700 }}>{editingId ? 'Update' : 'Add'}</button>
          {editingId && <button type="button" onClick={()=>{ setEditingId(null); setForm(empty); }} style={{ marginLeft: 8, padding: '10px 16px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700 }}>Cancel</button>}
        </div>
      </form>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: 8, overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: '#f0f7f0' }}>
              {['Name','Type','City','Price','Rating','Available','Actions'].map(h => <th key={h} style={{ textAlign: 'left', padding: 12, borderBottom: '2px solid #4a7c59' }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {items.map(it => (
              <tr key={it._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: 12 }}>{it.name}</td>
                <td style={{ padding: 12 }}>{it.type}</td>
                <td style={{ padding: 12 }}>{it.city}</td>
                <td style={{ padding: 12 }}>${it.price}</td>
                <td style={{ padding: 12 }}>{it.rating}</td>
                <td style={{ padding: 12 }}>{it.availability ? 'Yes' : 'No'}</td>
                <td style={{ padding: 12 }}>
                  <button onClick={()=>edit(it)} style={{ padding: '6px 10px', background: '#4a7c59', color: '#fff', border: 'none', borderRadius: 6, marginRight: 6 }}>Edit</button>
                  <button onClick={()=>del(it._id)} style={{ padding: '6px 10px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: 6 }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAccommodations;


