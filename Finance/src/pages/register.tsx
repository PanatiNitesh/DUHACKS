import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    industry: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password || !formData.companyName || !formData.industry) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await axios.post("https://duhacks-p6t6.onrender.com/api/register", formData);
      if (response.data.success) {
        localStorage.setItem("username", response.data.username); 
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    }
  };
  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };
  
  return (
    <div className="div">
      <nav className="navbar">
              <div className="navbar-brand">
                <h1>Cost-Sage</h1>
              </div>
              <div className="navbar-links">
              <button className="go-back-button" onClick={handleGoBack}>
          ← Go Back
        </button>
              </div>
            </nav>
    <div className="register-container">
      <h2>Register for Cost-Sage</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>
        <div className="form-group">
          <label>Company Name</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Enter your company name"
            required
          />
        </div>
        <div className="form-group">
          <label>Industry</label>
          <select name="industry" value={formData.industry} onChange={handleChange} required>
            <option value="">Select your industry</option>
            <option value="Finance">Finance</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Retail">Retail</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Technology">Technology</option>
          </select>
        </div>
        <button type="submit" className="register-button">
          Register
        </button>
      </form>
    </div>
    </div>
  );
};

export default Register;
