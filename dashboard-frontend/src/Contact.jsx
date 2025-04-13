import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Contact.css";

function Contact() {
  const [language, setLanguage] = useState("en");

  const t = {
    en: {
      home: "Home",
      about: "About",
      services: "Services",
      contact: "Contact",
      login: "Login",
      signup: "Sign Up",
      company: "Company",
      phone: "Phone",
      email: "Email",
      contactUs: "Contact Us",
      yourName: "Your Name",
      yourEmail: "Your Email",
      yourMessage: "Your Message",
      sendMessage: "Send Message",
      thankYou: "Thank you for contacting us!",
      language: "English-EN",
      tamil: "Tamil-Tam",
    },
    ta: {
      home: "முகப்பு",
      about: "எங்களை பற்றி",
      services: "சேவைகள்",
      contact: "தொடர்பு கொள்ள",
      login: "உள்நுழை",
      signup: "பதிவு செய்யவும்",
      company: "நிறுவனம்",
      phone: "தொலைபேசி",
      email: "மின்னஞ்சல்",
      contactUs: "எங்களை தொடர்பு கொள்ளவும்",
      yourName: "உங்கள் பெயர்",
      yourEmail: "உங்கள் மின்னஞ்சல்",
      yourMessage: "உங்கள் செய்தி",
      sendMessage: "செய்தி அனுப்பு",
      thankYou: "தொடர்பு கொண்டதற்கு நன்றி!",
      language: "தமிழ்-Tam",
      tamil: "ஆங்கிலம்-EN",
    },
  }[language];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert(t.thankYou);
    setFormData({ name: "", email: "", message: "" });
  };

  const navigate = useNavigate();
  const home = () => navigate("/");
  const about = () => navigate("/about");
  const login = () => navigate("/login");
  const signup = () => navigate("/signup");
  const items = () => navigate("/items");

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar-123">
        <div className="navbar-logo-123">🌿Agro Zapp</div>

        <ul className="nav-links-123">
          <li>
            <a href="#" className="nav-item-123" onClick={home}>
              {t.home}
            </a>
          </li>
          <li>
            <a href="#" className="nav-item-123" onClick={about}>
              {t.about}
            </a>
          </li>
          <li>
            <a href="#" className="nav-item-123" onClick={items}>
              {t.services}
            </a>
          </li>
          <li>
            <a href="#" className="nav-item-123">
              {t.contact}
            </a>
          </li>
        </ul>

        <ul className="nav-links-123-right">
          <li>
            <a href="#" className="nav-item-login" onClick={login}>
              {t.login}
            </a>
          </li>
          <li>
            <a href="#" className="nav-item-signup" onClick={signup}>
              {t.signup}
            </a>
          </li>

          <li className="language-dropdown">
            <div className="language-toggle">{t.language}</div>
            <ul className="dropdown-menu">
              <li>
                <a
                  href="#"
                  onClick={() => setLanguage(language === "en" ? "ta" : "en")}
                >
                  {t.tamil}
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      {/* Contact Content */}
      <div className="contact-container">
        <h2 className="contact-title">{t.contactUs}</h2>

        <div className="contact-info">
          <p className="cc1">
            <strong>{t.company}:</strong> Team Benx solution
          </p>
          <p className="cc1">
            <strong>{t.phone}:</strong> +1 (123) 456-7890
          </p>
          <p className="cc1">
            <strong>{t.email}:</strong> support@technova.com
          </p>
        </div>

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label>{t.yourName}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>{t.yourEmail}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>{t.yourMessage}</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              required
              className="form-control"
            />
          </div>

          <button type="submit" className="submit-button">
            {t.sendMessage}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
