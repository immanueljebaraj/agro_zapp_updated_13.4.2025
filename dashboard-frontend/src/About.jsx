import React from "react";
import { FaRobot, FaMicrochip, FaGlobe, FaCogs } from "react-icons/fa";
import "./About.css"; // Import the CSS file

export default function About() {
  return (
    <div className="about-container-456">
      {/* Header Section */}
      <header className="about-header-456">
        <h1 className="about-title-456">AI-Powered Innovation</h1>
        <p className="about-subtitle-456">
          Revolutionizing Websites & Hardware with Artificial Intelligence
        </p>
      </header>

      {/* Introduction Section */}
      <section className="about-intro-456">
        <div className="intro-text-456">
          <h2>Who We Are</h2>
          <p>
            We are a cutting-edge technology company specializing in AI-driven 
            solutions that bridge the gap between smart software and intelligent hardware. 
            Our goal is to create seamless integrations that enhance efficiency, automation, 
            and user experience.
          </p>
        </div>
      </section>

      {/* Our Expertise Section */}
      <section className="expertise-section-456">
        <h2 className="expertise-title-456">Our Expertise</h2>
        <div className="expertise-cards-456">
          <div className="expertise-card-456">
            <FaGlobe className="expertise-icon-456" />
            <h3>AI for Websites</h3>
            <p>Automated chatbots, recommendation engines, and smart UX enhancements.</p>
          </div>
          <div className="expertise-card-456">
            <FaMicrochip className="expertise-icon-456" />
            <h3>AI in Hardware</h3>
            <p>Smart sensors, AI-driven automation, and edge computing solutions.</p>
          </div>
          <div className="expertise-card-456">
            <FaRobot className="expertise-icon-456" />
            <h3>Machine Learning</h3>
            <p>Custom ML models for real-time decision-making and analytics.</p>
          </div>
          <div className="expertise-card-456">
            <FaCogs className="expertise-icon-456" />
            <h3>IoT & AI</h3>
            <p>Seamless AI-powered IoT integrations for smart industries.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section-456">
        <h2>Ready to Innovate?</h2>
        <p>Let's build intelligent solutions together. Get in touch with our AI experts today.</p>
        <button className="cta-button-456">Contact Us</button>
      </section>

      {/* Footer */}
      <footer className="about-footer-456">
        <p>&copy; 2025 AI Integration Hub. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

