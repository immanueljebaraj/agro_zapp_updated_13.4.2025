import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginSignup.css"; // Keep using existing styles
import phone_icon from "../assets/phone.svg";
import password_icon from "../assets/password.svg";

export default function Login() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/user/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact_number: mobile, // Use 'contact_number' instead of 'mobile'
          password: password,
        }),
      });

      const data = await response.json();
      console.log("Response data:", data); // Debugging: Log the response data

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      // Save tokens to localStorage
      localStorage.setItem("access_token", data.tokens.access);
      localStorage.setItem("refresh_token", data.tokens.refresh);
      console.log("Tokens saved to localStorage"); // Debugging: Log token storage

      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/intermediate"), 1500);
    } catch (err) {
      console.error("Error:", err); // Debugging: Log the error
      setError(err.message || "Something went wrong. Try again.");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">Login</div>
        <div className="underline"></div>
      </div>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form onSubmit={handleLogin}>
        <div className="inputs">
          <div className="input">
            <img className="form-icons" src={phone_icon} alt="Mobile No." />
            <input
              type="tel"
              placeholder="Mobile No."
              value={mobile}
              onChange={(e) => {
                setMobile(e.target.value);
                console.log("Mobile:", e.target.value); // Debugging: Log mobile input
              }}
              required
            />
          </div>

          <div className="input">
            <img className="form-icons" src={password_icon} alt="Password" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                console.log("Password:", e.target.value); // Debugging: Log password input
              }}
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            Log in
          </button>
          <a href="/signup">New Here? Sign Up</a>
        </div>
      </form>
    </div>
  );
}
