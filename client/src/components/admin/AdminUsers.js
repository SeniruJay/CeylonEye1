import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    role: "user",
    isActive: true
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/users", form);
      setForm({ username: "", email: "", password: "", firstName: "", lastName: "", phone: "", role: "user", isActive: true });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create user");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete user");
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
      <div>
        <h2 style={{ color: '#1f4b1a' }}>All Users</h2>
        <div style={{ border: '1px solid #e8f5e8', borderRadius: 8 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fff8' }}>
                <th style={{ textAlign: 'left', padding: 8 }}>Name</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Email</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Role</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Status</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} style={{ borderTop: '1px solid #e8f5e8' }}>
                  <td style={{ padding: 8 }}>{u.firstName} {u.lastName}</td>
                  <td style={{ padding: 8 }}>{u.email}</td>
                  <td style={{ padding: 8 }}>{u.role}</td>
                  <td style={{ padding: 8 }}>{u.isActive ? 'Active' : 'Inactive'}</td>
                  <td style={{ padding: 8 }}>
                    <button onClick={() => handleDelete(u._id)} style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 style={{ color: '#1f4b1a' }}>Create User</h2>
        <form onSubmit={handleCreate} style={{ border: '1px solid #e8f5e8', borderRadius: 8, padding: 12 }}>
          <div style={{ display: 'grid', gap: 8 }}>
            <input placeholder="Username" name="username" value={form.username} onChange={handleChange} required style={{ padding: 8, borderRadius: 6, border: '1px solid #cfe3cf' }} />
            <input placeholder="Email" type="email" name="email" value={form.email} onChange={handleChange} required style={{ padding: 8, borderRadius: 6, border: '1px solid #cfe3cf' }} />
            <input placeholder="Password" type="password" name="password" value={form.password} onChange={handleChange} required style={{ padding: 8, borderRadius: 6, border: '1px solid #cfe3cf' }} />
            <input placeholder="First Name" name="firstName" value={form.firstName} onChange={handleChange} required style={{ padding: 8, borderRadius: 6, border: '1px solid #cfe3cf' }} />
            <input placeholder="Last Name" name="lastName" value={form.lastName} onChange={handleChange} required style={{ padding: 8, borderRadius: 6, border: '1px solid #cfe3cf' }} />
            <input placeholder="Phone" name="phone" value={form.phone} onChange={handleChange} required style={{ padding: 8, borderRadius: 6, border: '1px solid #cfe3cf' }} />
            <select name="role" value={form.role} onChange={handleChange} style={{ padding: 8, borderRadius: 6, border: '1px solid #cfe3cf', background: '#fff' }}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} /> Active
            </label>
            <button type="submit" style={{ background: '#2d7a50', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUsers;
