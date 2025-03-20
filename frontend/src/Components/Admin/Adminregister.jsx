import React, { useState } from "react";
import "../../css/admin/adminregister.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASEURL } from "../../Auth/Matcher";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Adminregister = () => {
  const [formdata, setFormData] = useState({
    admin_username: "",
    admin_password: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    } else {
      setFormData({
        ...formdata,
        [name]: value,
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("admin_username", formdata.admin_username);
      formData.append("admin_password", formdata.admin_password);
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const response = await axios.post(`${BASEURL}/admin/admin-register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        toast.success("Registration successful!");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      console.error("Error registering admin:", error);
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="admin-register-container">
      <form className="admin-register-form" onSubmit={handleRegister}>
        <h2 className="form-title">Signup</h2>
        {profileImagePreview ? (
            <div className="avatar-preview">
              <img
                src={profileImagePreview}
                alt="Profile Avatar"
                className="avatar-img"
              />
            </div>
          ) : (
            <div className="avatar-placeholder">Avatar</div>
          )}
        <div className="form-group">
          <input
            type="text"
            name="admin_username"
            value={formdata.admin_username}
            onChange={handleChange}
            required
            className="form-input"
          />
          <label className="form-label">Enter your username</label>
        </div>
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
        
        
        <div className="avatar-upload">
          
          <input
            type="file"
            name="profileImage"
            onChange={handleChange}
            className="form-input"
            accept="image/*"
          />
          
        
        
        </div>

        <button type="submit" className="register-button">Create</button>
        <div className="login-link">
          <p>
            Have an account? <Link to="/">Login</Link>
          </p>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Adminregister;
