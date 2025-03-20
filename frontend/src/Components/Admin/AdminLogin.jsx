import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../css/admin/admin.css"
import { Link, useNavigate } from "react-router-dom";
import ProfileOverlap from "./ProfileOverlap";
import { BASEURL } from "../../Auth/Matcher";

const AdminLogin = () => {
  const [formdata, setFormData] = useState({
    admin_username: "",
    admin_password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [usersdata, setUserData] = useState(null);
  const [username, setUserName] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formdata,
      [name]: value,
    });
  };

  const fetchAdmin = async () => {
    try {
      const adminFetch = await axios.get(`${BASEURL}/admin/admin`);

      setUserData(adminFetch?.data?.adminUsers || []);
    } catch (err) {
      setError("Failed to fetch admin users.");
      console.error("Error fetching admin users:", err);
    }
  };

  useEffect(() => {
    fetchAdmin();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${BASEURL}/admin/admin-login`, {
        admin_username: formdata.admin_username,
        admin_password: formdata.admin_password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      }
    } catch (error) {
      setError("Login failed. Please check your credentials.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (username) {
      setFormData({
        ...formdata,
        admin_username: username,
      });
    }
  }, [username]);

  
  return (
    <div className="admin-login-container">
      <form className="admin-login-form" onSubmit={handleLogin}>
        <h2 className="form-title">Login</h2>
        <ProfileOverlap users={usersdata} setUserName={setUserName} />
        {error && <div className="error-message">{error}</div>}
        {username ? (
          <div className="form-floating mb-3">
            <input
               style={{ color: "gray", backgroundColor: "#f0f0f0" }}
              type="email"
              className="form-control"
              id="floatingInputDisabled"
              placeholder="name@example.com"
              disabled
            />
            <label htmlFor="floatingInputDisabled">{username}</label>
          </div>
        ) : (
          <div className="form-group">
            <input
              type="text"
              name="admin_username"
              value={formdata.admin_username}
              onChange={handleChange}
              required
              className="form-input"
            />
            <label className="form-label">Enter your Admin Name</label>
          </div>
        )}

        <div className="form-group">
          <input
            type="password"
            name="admin_password"
            value={formdata.admin_password}
            onChange={handleChange}
            required
            className="form-input"
          />
          <label className="form-label">Enter your password</label>
        </div>
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Logging In..." : "Log In"}
        </button>
        <div className="register-link">
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;
