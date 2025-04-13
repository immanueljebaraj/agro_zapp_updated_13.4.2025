import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginSignup.css";
import user_icon from "../assets/profile.svg";
import id_icon from "../assets/id-card.svg";
import phone_icon from "../assets/phone.svg";
import password_icon from "../assets/password.svg";

export default function LoginSignup() {
  const [action, setAction] = useState("Sign Up");
  const [name, setName] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(""); // Clear any previous errors

    console.log("Form submitted"); // Debugging: Log form submission

    // Define the API endpoint based on the action (Sign Up or Login)
    const url =
      action === "Sign Up"
        ? "http://127.0.0.1:8000/api/user/register/"
        : "http://127.0.0.1:8000/api/user/login/";

    // Prepare the payload based on the action
    const payload =
      action === "Sign Up"
        ? {
            name: name,
            contact_number: mobile,
            aadhar_card: aadhaar,
            password: password,
          }
        : {
            contact_number: mobile,
            password: password,
          };

    console.log("Sending request to:", url); // Debugging: Log the API endpoint
    console.log("Payload:", payload); // Debugging: Log the payload

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status); // Debugging: Log the response status

      const data = await response.json();
      console.log("Response data:", data); // Debugging: Log the response data

      if (!response.ok) {
        // Handle backend validation errors
        if (data.errors) {
          const errorMessage = Object.values(data.errors).join(" ");
          console.error("Backend validation errors:", errorMessage); // Debugging: Log validation errors
          throw new Error(errorMessage);
        } else {
          console.error(
            "Backend error:",
            data.message || "Something went wrong"
          ); // Debugging: Log backend error
          throw new Error(data.message || "Something went wrong");
        }
      }

      console.log(
        action === "Sign Up" ? "Sign Up Successful" : "Login Successful",
        data
      ); // Debugging: Log success message

      // Save tokens to localStorage for future authenticated requests
      if (data.tokens) {
        localStorage.setItem("access_token", data.tokens.access);
        localStorage.setItem("refresh_token", data.tokens.refresh);
        console.log("Tokens saved to localStorage"); // Debugging: Log token storage
      }

      // Navigate to the dashboard after successful login/signup
      navigate("/dashboard");
      console.log("Navigating to /dashboard"); // Debugging: Log navigation
    } catch (error) {
      console.error("Error:", error); // Debugging: Log the error
      setError(error.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="inputs">
          {action === "Sign Up" && (
            <>
              <div className="input">
                <img className="form-icons" src={user_icon} alt="Name" />
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    console.log("Name:", e.target.value); // Debugging: Log name input
                  }}
                  required
                />
              </div>
              <div className="input">
                <img className="form-icons" src={id_icon} alt="AADHAAR No." />
                <input
                  type="text"
                  placeholder="AADHAAR No."
                  value={aadhaar}
                  onChange={(e) => {
                    setAadhaar(e.target.value);
                    console.log("Aadhaar:", e.target.value); // Debugging: Log Aadhaar input
                  }}
                  required
                />
              </div>
            </>
          )}

          <div className="input" id="mobile-no">
            <img className="form-icons" src={phone_icon} alt="Mobile No." />
            <input
              type="tel"
              placeholder="Mobile no."
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

          {action === "Login" && (
            <div className="forgot-password">
              Lost password? <span>Click here!</span>
            </div>
          )}

          <div className="submit-container">
            <div
              className={action === "Login" ? "submit gray" : "submit"}
              onClick={() => {
                setAction("Sign Up");
                console.log("Switched to Sign Up"); // Debugging: Log action switch
              }}
            >
              Sign up
            </div>
            <div
              className={action === "Sign Up" ? "submit gray" : "submit"}
              onClick={() => {
                setAction("Login");
                console.log("Switched to Login"); // Debugging: Log action switch
              }}
            >
              Log in
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
