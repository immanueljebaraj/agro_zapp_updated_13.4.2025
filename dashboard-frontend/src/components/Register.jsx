import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginSignup.css"; // Keep using existing styles
import user_icon from "../assets/profile.svg";
import id_icon from "../assets/id-card.svg";
import phone_icon from "../assets/phone.svg";
import password_icon from "../assets/password.svg";

export default function Signup() {
  const [name, setName] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/user/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          contact_number: mobile, // Use 'contact_number' instead of 'mobile'
          aadhar_card: aadhaar, // Use 'aadhar_card' instead of 'aadhaar'
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      setSuccess("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">Sign Up</div>
        <div className="underline"></div>
      </div>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form onSubmit={handleSignup}>
        <div className="inputs">
          <div className="input">
            <img className="form-icons" src={user_icon} alt="Name" />
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input">
            <img className="form-icons" src={id_icon} alt="AADHAAR No." />
            <input
              type="text"
              placeholder="AADHAAR No."
              value={aadhaar}
              onChange={(e) => setAadhaar(e.target.value)}
              required
            />
          </div>

          <div className="input">
            <img className="form-icons" src={phone_icon} alt="Mobile No." />
            <input
              type="tel"
              placeholder="Mobile No."
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>

          <div className="input">
            <img className="form-icons" src={password_icon} alt="Password" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            Sign Up
          </button>
          <a href="/login">Already registered? Login</a>
        </div>
      </form>
    </div>
  );
}
