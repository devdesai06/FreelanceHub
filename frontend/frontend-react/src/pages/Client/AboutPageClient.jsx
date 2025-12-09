import React from "react";
import "../../styles/About.css";
import { FaUsers, FaHandshake, FaShieldAlt, FaRocket, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ClientAbout() {

  const navigate = useNavigate();

  return (
    <div className="about-container">

      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft />
        <span>Back</span>
      </button>

      <section className="hero">
        <h1>Empowering You to Hire Better & Faster</h1>
        <p>
          FreelanceHub helps clients connect with trusted, skilled freelancers 
          in the simplest way. Post. Receive bids. Hire. Work. All in one place.
        </p>
      </section>

      <section className="about-grid">
        <div className="about-card">
          <FaUsers className="about-icon" />
          <h3>Top Freelancers</h3>
          <p>
            Connect with verified experts across web development, design, 
            content, SEO, marketing & more.
          </p>
        </div>

        <div className="about-card">
          <FaHandshake className="about-icon" />
          <h3>Transparent Bidding</h3>
          <p>
            Compare proposals, negotiate easily, and choose the perfect match 
            for your project.
          </p>
        </div>

        <div className="about-card">
          <FaShieldAlt className="about-icon" />
          <h3>Secure Payments</h3>
          <p>
            Pay only when you’re satisfied. Your money stays protected until 
            project completion.
          </p>
        </div>

        <div className="about-card">
          <FaRocket className="about-icon" />
          <h3>Fast Hiring Process</h3>
          <p>
            Get work started within minutes — no long waits, no unnecessary steps.
          </p>
        </div>
      </section>

      <section className="mission">
        <h2>Our Mission</h2>
        <p>
          To simplify the hiring process for clients by offering a seamless, 
          transparent, and trustworthy platform where great ideas meet 
          talented freelancers.
        </p>
      </section>

    </div>
  );
}
