import React from "react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import "./Home.css"; // Import the updated CSS file
import { useNavigate } from "react-router-dom";

export default function Home() {
  let navigate = useNavigate();

  const shop = () => {
    navigate("/items");
  };

  const about = () => {
    navigate("./about");
  };

  const login = () => {
    navigate("./login");
  };

  const signup = () => {
    navigate("./signup");
  };

  const items = () => {
    navigate("./items");
  };

  return (
    <div className="landing-container-123">
      {/* Navbar */}
      <nav className="navbar-123">
        <div className="navbar-logo-123">🌿Agro Zapp</div>
        <ul className="nav-links-123">
          <li>
            <a href="#" className="nav-item-123">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="nav-item-123" onClick={about}>
              About
            </a>
          </li>
          <li>
            <a href="#" onClick={items} className="nav-item-123">
              Services
            </a>
          </li>
          <li>
            <a href="#" className="nav-item-123">
              Contact
            </a>
          </li>
        </ul>
        <ul class="nav-links-123">
          <li>
            <a href="#" className="nav-item-123" onClick={login}>
              Login
            </a>
          </li>
          <li>
            <a href="#" className="nav-item-123" onClick={signup}>
              Sign Up
            </a>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="hero-section-123">
        <h1 className="hero-title-123">Welcome to Agrozapp</h1>
        <p className="hero-text-123">
          Your one-stop destination for sustainable and eco-friendly products.
          Shop responsibly and help the planet!
        </p>
        <button className="btn-secondary-123" onClick={shop}>
          Explore Now
        </button>
      </section>

      {/* Features Section */}
      <section className="features-section-123">
        <h2 className="features-title-123">Why Choose Us?</h2>
        <div className="features-container-123">
          <div className="feature-card-123">
            <h3 className="feature-heading-123">Sustainable Products</h3>
            <p className="feature-text-123">
              All our products are sourced from eco-friendly materials.
            </p>
          </div>
          <div className="feature-card-123">
            <h3 className="feature-heading-123">Fast Delivery</h3>
            <p className="feature-text-123">
              We ensure timely delivery with minimal carbon footprint.
            </p>
          </div>
          <div className="feature-card-123">
            <h3 className="feature-heading-123">Customer Support</h3>
            <p className="feature-text-123">
              24/7 support for all your queries and concerns.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-123">
        <p className="footer-text-123">
          &copy; 2025 EcoShop. All Rights Reserved.
        </p>
        <div className="social-icons-123">
          <FaFacebook className="social-icon-123" />
          <FaTwitter className="social-icon-123" />
          <FaInstagram className="social-icon-123" />
        </div>
      </footer>
    </div>
  );
}