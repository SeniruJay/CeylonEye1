import React, { useEffect, useState } from "react";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    role: "user"
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/auth/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/auth/register", newUser, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("User created successfully!");
      setShowAddUser(false);
      setNewUser({
        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: "",
        role: "user"
      });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create user");
      console.error(err);
    }
  };

  const handleUpdateUser = async (userId, updates) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/auth/users/${userId}`, updates, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("User updated successfully!");
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      alert("Failed to update user");
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (window.confirm(`Are you sure you want to delete user "${username}"?`)) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/auth/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        alert("User deleted successfully!");
        fetchUsers();
      } catch (err) {
        alert("Failed to delete user");
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h2 style={{ color: "#4a7c59" }}>Loading users...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "red" }}>
        <h2>Error</h2>
        <p>{error}</p>
        <button 
          onClick={fetchUsers} 
          style={{ 
            padding: "10px 20px", 
            marginTop: "10px",
            backgroundColor: "#4a7c59",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h2 style={{ color: "#2d5a27", margin: 0 }}>User Management</h2>
        <button
          onClick={() => setShowAddUser(true)}
          style={{
            backgroundColor: "#4a7c59",
            color: "white",
            padding: "12px 24px",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s ease"
          }}
        >
          + Add New User
        </button>
      </div>

      {users.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "40px", 
          backgroundColor: "white", 
          borderRadius: "12px",
          boxShadow: "0 4px 8px rgba(74, 124, 89, 0.1)",
          border: "2px dashed #4a7c59"
        }}>
          <h3 style={{ color: "#4a7c59", marginBottom: "10px" }}>No users found</h3>
          <p style={{ color: "#666" }}>Click "Add New User" to get started.</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ 
            width: "100%", 
            borderCollapse: "collapse", 
            backgroundColor: "white",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            borderRadius: "8px",
            overflow: "hidden"
          }}>
            <thead>
              <tr style={{ backgroundColor: "#f0f7f0" }}>
                <th style={{ padding: "15px", textAlign: "left", borderBottom: "2px solid #4a7c59", color: "#2d5a27", fontWeight: "600" }}>Name</th>
                <th style={{ padding: "15px", textAlign: "left", borderBottom: "2px solid #4a7c59", color: "#2d5a27", fontWeight: "600" }}>Username</th>
                <th style={{ padding: "15px", textAlign: "left", borderBottom: "2px solid #4a7c59", color: "#2d5a27", fontWeight: "600" }}>Email</th>
                <th style={{ padding: "15px", textAlign: "left", borderBottom: "2px solid #4a7c59", color: "#2d5a27", fontWeight: "600" }}>Phone</th>
                <th style={{ padding: "15px", textAlign: "left", borderBottom: "2px solid #4a7c59", color: "#2d5a27", fontWeight: "600" }}>Status</th>
                <th style={{ padding: "15px", textAlign: "center", borderBottom: "2px solid #4a7c59", color: "#2d5a27", fontWeight: "600" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} style={{ borderBottom: "1px solid #dee2e6" }}>
                  <td style={{ padding: "15px", fontWeight: "500" }}>
                    {user.firstName} {user.lastName}
                  </td>
                  <td style={{ padding: "15px" }}>{user.username}</td>
                  <td style={{ padding: "15px" }}>{user.email}</td>
                  <td style={{ padding: "15px" }}>{user.phone}</td>
                  <td style={{ padding: "15px" }}>
                    <span style={{
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      backgroundColor: user.isActive ? "#d4edda" : "#f8d7da",
                      color: user.isActive ? "#2d5a27" : "#721c24",
                      border: user.isActive ? "1px solid #4a7c59" : "1px solid #dc3545"
                    }}>
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ padding: "15px", textAlign: "center" }}>
                    <button
                      onClick={() => handleUpdateUser(user._id, { isActive: !user.isActive })}
                      style={{
                        backgroundColor: user.isActive ? "#dc3545" : "#28a745",
                        color: "white",
                        padding: "6px 12px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px",
                        marginRight: "8px"
                      }}
                    >
                      {user.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id, user.username)}
                      style={{
                        backgroundColor: "#dc3545",
                        color: "white",
                        padding: "6px 12px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px"
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUser && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px"
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: "15px",
            padding: "30px",
            width: "100%",
            maxWidth: "500px",
            maxHeight: "90vh",
            overflow: "auto"
          }}>
            <h2 style={{ color: "#2d5a27", marginBottom: "25px" }}>
              Add New User
            </h2>
            
            <form onSubmit={handleAddUser}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2d5a27" }}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "2px solid #e8f5e8",
                      borderRadius: "6px",
                      fontSize: "14px",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2d5a27" }}>
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "2px solid #e8f5e8",
                      borderRadius: "6px",
                      fontSize: "14px",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2d5a27" }}>
                  Username *
                </label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "2px solid #e8f5e8",
                    borderRadius: "6px",
                    fontSize: "14px",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2d5a27" }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "2px solid #e8f5e8",
                    borderRadius: "6px",
                    fontSize: "14px",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2d5a27" }}>
                  Phone *
                </label>
                <input
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "2px solid #e8f5e8",
                    borderRadius: "6px",
                    fontSize: "14px",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2d5a27" }}>
                  Password *
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "2px solid #e8f5e8",
                    borderRadius: "6px",
                    fontSize: "14px",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "25px" }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: "12px",
                    backgroundColor: "#4a7c59",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Create User
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer"
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
  );
};

export default UserManagement;
