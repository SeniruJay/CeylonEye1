import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaPlus,
  FaTrashAlt,
  FaUserCheck,
  FaUserTimes,
  FaTimes,
  FaEdit,
  FaSearch,
} from "react-icons/fa";
import AdminNavbar from "./admin/AdminNavbar";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    role: "user",
  });
  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const validateForm = () => {
    const errors = {};
    const nameRegex = /^[A-Za-z\s]{2,50}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{7,15}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!editingUser) {
      if (!nameRegex.test(formData.firstName)) {
        errors.firstName =
          "First name must be 2-50 characters, letters and spaces only";
      }
      if (!nameRegex.test(formData.lastName)) {
        errors.lastName =
          "Last name must be 2-50 characters, letters and spaces only";
      }
      if (!emailRegex.test(formData.email)) {
        errors.email = "Please enter a valid email address";
      }
      if (!phoneRegex.test(formData.phone)) {
        errors.phone = "Phone must be 7-15 digits only";
      }
      if (!passwordRegex.test(formData.password)) {
        errors.password =
          "Password must be 8+ characters with uppercase, lowercase, number, and special character";
      }
    } else if (formData.password) {
      if (!passwordRegex.test(formData.password)) {
        errors.password =
          "Password must be 8+ characters with uppercase, lowercase, number, and special character";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem("token");
      const url = editingUser
        ? `http://localhost:5000/api/auth/users/${editingUser._id}`
        : "http://localhost:5000/api/auth/register";
      const method = editingUser ? axios.put : axios.post;
      const data = { ...formData };
      if (editingUser && !data.password) delete data.password;
      await method(url, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(
        editingUser
          ? "User updated successfully!"
          : "User created successfully!"
      );
      setShowForm(false);
      setEditingUser(null);
      resetForm();
      fetchUsers();
    } catch (err) {
      alert(
        err.response?.data?.error ||
          (editingUser ? "Failed to update user" : "Failed to create user")
      );
    }
  };

  const handleToggleActive = async (userId, isActive) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/auth/users/${userId}`,
        { isActive: !isActive },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("User status updated successfully!");
      fetchUsers();
    } catch (err) {
      alert("Failed to update user status");
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (window.confirm(`Are you sure you want to delete user "${username}"?`)) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/auth/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("User deleted successfully!");
        fetchUsers();
      } catch (err) {
        alert("Failed to delete user");
      }
    }
  };

  const handleEditUser = (user) => {
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role || "user",
    });
    setEditingUser(user);
    setShowForm(true);
    setFormErrors({});
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
      role: "user",
    });
    setFormErrors({});
  };

  const filteredUsers = users.filter(
    (user) =>
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px",
          fontSize: "18px",
          color: "#2d5a27",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        Loading users...
      </div>
    );

  if (error)
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px",
          color: "#dc3545",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <h2 style={{ fontSize: "24px", fontWeight: "600" }}>Error</h2>
        <p style={{ fontSize: "16px" }}>{error}</p>
        <button
          onClick={fetchUsers}
          style={{
            padding: "10px 20px",
            background: "linear-gradient(135deg, #007bff, #0056b3)",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            margin: "10px auto",
            fontSize: "14px",
            fontWeight: "600",
            transition: "all 0.2s ease",
          }}
        >
          <FaSearch /> Retry
        </button>
      </div>
    );

  return (
    <div>
      <AdminNavbar />
      <div
        style={{
          padding: "20px",
          maxWidth: "1200px",
          margin: "0 auto",
          fontFamily: "'Inter', sans-serif",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            backgroundColor: "white",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{
              color: "#2d5a27",
              margin: 0,
              fontSize: "22px",
              fontWeight: "600",
            }}
          >
            User Management
          </h2>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            style={{
              background: "linear-gradient(135deg, #007bff, #0056b3)",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <FaPlus /> Add User
          </button>
        </div>

        <div style={{ position: "relative", marginBottom: "24px" }}>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 40px 12px 16px",
              border: "1px solid #e8f5e8",
              borderRadius: "8px",
              fontSize: "14px",
              backgroundColor: "white",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              transition: "border-color 0.2s ease",
            }}
          />
          <FaSearch
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#6c757d",
            }}
          />
        </div>

        {filteredUsers.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              border: "1px dashed #4a7c59",
            }}
          >
            <h3
              style={{
                color: "#2d5a27",
                marginBottom: "10px",
                fontSize: "18px",
                fontWeight: "600",
              }}
            >
              No Users Found
            </h3>
            <p style={{ color: "#666", fontSize: "14px" }}>
              Add a new user or adjust your search.
            </p>
          </div>
        ) : (
          <div
            style={{
              overflowX: "auto",
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: "0",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "linear-gradient(135deg, #f0f7f0, #e8f5e8)",
                  }}
                >
                  {[
                    "Name",
                    "Username",
                    "Email",
                    "Phone",
                    "Role",
                    "Status",
                    "Actions",
                  ].map((header, idx) => (
                    <th
                      key={idx}
                      style={{
                        padding: "16px",
                        textAlign: "left",
                        borderBottom: "2px solid #4a7c59",
                        color: "#2d5a27",
                        fontWeight: "600",
                        fontSize: "14px",
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    style={{
                      borderBottom: "1px solid #e8f5e8",
                      transition: "background-color 0.2s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f8f9fa")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <td
                      style={{
                        padding: "16px",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {user.firstName} {user.lastName}
                    </td>
                    <td style={{ padding: "16px", fontSize: "14px" }}>
                      {user.username}
                    </td>
                    <td style={{ padding: "16px", fontSize: "14px" }}>
                      {user.email}
                    </td>
                    <td style={{ padding: "16px", fontSize: "14px" }}>
                      {user.phone}
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        fontSize: "14px",
                        textTransform: "capitalize",
                      }}
                    >
                      {user.role || "user"}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span
                        style={{
                          padding: "6px 16px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600",
                          backgroundColor: user.isActive
                            ? "#d4edda"
                            : "#f8d7da",
                          color: user.isActive ? "#2d5a27" : "#721c24",
                          border: user.isActive
                            ? "1px solid #4a7c59"
                            : "1px solid #dc3545",
                        }}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        display: "flex",
                        gap: "8px",
                        justifyContent: "center",
                      }}
                    >
                      <button
                        onClick={() => handleEditUser(user)}
                        style={{
                          backgroundColor: "#ffc107",
                          color: "#212529",
                          padding: "8px 12px",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "12px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          transition: "all 0.2s ease",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                        title="Edit Role"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() =>
                          handleToggleActive(user._id, user.isActive)
                        }
                        style={{
                          backgroundColor: user.isActive
                            ? "#dc3545"
                            : "#28a745",
                          color: "white",
                          padding: "8px 12px",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "12px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          transition: "all 0.2s ease",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                        title={user.isActive ? "Deactivate" : "Activate"}
                      >
                        {user.isActive ? <FaUserTimes /> : <FaUserCheck />}{" "}
                        {user.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteUser(user._id, user.username)
                        }
                        style={{
                          backgroundColor: "#dc3545",
                          color: "white",
                          padding: "8px 12px",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "12px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          transition: "all 0.2s ease",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                        title="Delete"
                      >
                        <FaTrashAlt /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showForm && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "20px",
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "24px",
                width: "100%",
                maxWidth: "600px",
                maxHeight: "90vh",
                overflow: "auto",
                boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <h2
                  style={{
                    color: "#2d5a27",
                    margin: 0,
                    fontSize: "20px",
                    fontWeight: "600",
                  }}
                >
                  {editingUser ? "Edit User Role" : "Add New User"}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingUser(null);
                    resetForm();
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#6c757d",
                    fontSize: "18px",
                    transition: "color 0.2s ease",
                  }}
                >
                  <FaTimes />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        fontWeight: "600",
                        color: "#2d5a27",
                        fontSize: "14px",
                      }}
                    >
                      First Name {editingUser ? "" : "*"}
                    </label>
                    <input
                      type="text"
                      placeholder="Enter first name"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      required={!editingUser}
                      disabled={!!editingUser}
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: `1px solid ${
                          formErrors.firstName ? "#dc3545" : "#e8f5e8"
                        }`,
                        borderRadius: "6px",
                        fontSize: "14px",
                        backgroundColor: editingUser ? "#f8f9fa" : "white",
                        transition:
                          "border-color 0.2s ease, box-shadow 0.2s ease",
                        boxShadow: `0 1px 3px rgba(0,0,0,0.05) ${
                          formErrors.firstName
                            ? ", 0 0 0 2px rgba(220,53,69,0.2)"
                            : ""
                        }`,
                      }}
                    />
                    {formErrors.firstName && (
                      <p
                        style={{
                          color: "#dc3545",
                          fontSize: "12px",
                          marginTop: "4px",
                        }}
                      >
                        {formErrors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        fontWeight: "600",
                        color: "#2d5a27",
                        fontSize: "14px",
                      }}
                    >
                      Last Name {editingUser ? "" : "*"}
                    </label>
                    <input
                      type="text"
                      placeholder="Enter last name"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      required={!editingUser}
                      disabled={!!editingUser}
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: `1px solid ${
                          formErrors.lastName ? "#dc3545" : "#e8f5e8"
                        }`,
                        borderRadius: "6px",
                        fontSize: "14px",
                        backgroundColor: editingUser ? "#f8f9fa" : "white",
                        transition:
                          "border-color 0.2s ease, box-shadow 0.2s ease",
                        boxShadow: `0 1px 3px rgba(0,0,0,0.05) ${
                          formErrors.lastName
                            ? ", 0 0 0 2px rgba(220,53,69,0.2)"
                            : ""
                        }`,
                      }}
                    />
                    {formErrors.lastName && (
                      <p
                        style={{
                          color: "#dc3545",
                          fontSize: "12px",
                          marginTop: "4px",
                        }}
                      >
                        {formErrors.lastName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        fontWeight: "600",
                        color: "#2d5a27",
                        fontSize: "14px",
                      }}
                    >
                      Username {editingUser ? "" : "*"}
                    </label>
                    <input
                      type="text"
                      placeholder="Enter username"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      required={!editingUser}
                      disabled={!!editingUser}
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #e8f5e8",
                        borderRadius: "6px",
                        fontSize: "14px",
                        backgroundColor: editingUser ? "#f8f9fa" : "white",
                        transition:
                          "border-color 0.2s ease, box-shadow 0.2s ease",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        fontWeight: "600",
                        color: "#2d5a27",
                        fontSize: "14px",
                      }}
                    >
                      Email {editingUser ? "" : "*"}
                    </label>
                    <input
                      type="email"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required={!editingUser}
                      disabled={!!editingUser}
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: `1px solid ${
                          formErrors.email ? "#dc3545" : "#e8f5e8"
                        }`,
                        borderRadius: "6px",
                        fontSize: "14px",
                        backgroundColor: editingUser ? "#f8f9fa" : "white",
                        transition:
                          "border-color 0.2s ease, box-shadow 0.2s ease",
                        boxShadow: `0 1px 3px rgba(0,0,0,0.05) ${
                          formErrors.email
                            ? ", 0 0 0 2px rgba(220,53,69,0.2)"
                            : ""
                        }`,
                      }}
                    />
                    {formErrors.email && (
                      <p
                        style={{
                          color: "#dc3545",
                          fontSize: "12px",
                          marginTop: "4px",
                        }}
                      >
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        fontWeight: "600",
                        color: "#2d5a27",
                        fontSize: "14px",
                      }}
                    >
                      Phone {editingUser ? "" : "*"}
                    </label>
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required={!editingUser}
                      disabled={!!editingUser}
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: `1px solid ${
                          formErrors.phone ? "#dc3545" : "#e8f5e8"
                        }`,
                        borderRadius: "6px",
                        fontSize: "14px",
                        backgroundColor: editingUser ? "#f8f9fa" : "white",
                        transition:
                          "border-color 0.2s ease, box-shadow 0.2s ease",
                        boxShadow: `0 1px 3px rgba(0,0,0,0.05) ${
                          formErrors.phone
                            ? ", 0 0 0 2px rgba(220,53,69,0.2)"
                            : ""
                        }`,
                      }}
                    />
                    {formErrors.phone && (
                      <p
                        style={{
                          color: "#dc3545",
                          fontSize: "12px",
                          marginTop: "4px",
                        }}
                      >
                        {formErrors.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        fontWeight: "600",
                        color: "#2d5a27",
                        fontSize: "14px",
                      }}
                    >
                      Role *
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      required
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #e8f5e8",
                        borderRadius: "6px",
                        fontSize: "14px",
                        backgroundColor: "white",
                        transition:
                          "border-color 0.2s ease, box-shadow 0.2s ease",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                      }}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontWeight: "600",
                      color: "#2d5a27",
                      fontSize: "14px",
                    }}
                  >
                    {editingUser ? "Reset Password (optional)" : "Password *"}
                  </label>
                  <input
                    type="password"
                    placeholder={
                      editingUser
                        ? "Leave blank to keep current password"
                        : "Enter password"
                    }
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required={!editingUser}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: `1px solid ${
                        formErrors.password ? "#dc3545" : "#e8f5e8"
                      }`,
                      borderRadius: "6px",
                      fontSize: "14px",
                      backgroundColor: "white",
                      transition:
                        "border-color 0.2s ease, box-shadow 0.2s ease",
                      boxShadow: `0 1px 3px rgba(0,0,0,0.05) ${
                        formErrors.password
                          ? ", 0 0 0 2px rgba(220,53,69,0.2)"
                          : ""
                      }`,
                    }}
                  />
                  {formErrors.password && (
                    <p
                      style={{
                        color: "#dc3545",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {formErrors.password}
                    </p>
                  )}
                </div>
                <div
                  style={{ display: "flex", gap: "12px", marginTop: "20px" }}
                >
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "linear-gradient(135deg, #007bff, #0056b3)",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    {editingUser ? "Update User" : "Create User"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingUser(null);
                      resetForm();
                    }}
                    style={{
                      flex: 1,
                      padding: "12px",
                      backgroundColor: "#6c757d",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
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

export default UserManagement;
