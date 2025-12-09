import React from "react";
import "../../styles/About.css";
import { FaLaptopCode, FaMoneyCheckAlt, FaBolt, FaChartLine, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function FreelancerAbout() {

  const navigate = useNavigate();

  return (
    <div className="about-container">

      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft />
        <span>Back</span>
      </button>

      <section className="hero">
        <h1>Your Skills. Your Earnings. Your Freedom.</h1>
        <p>
          FreelanceHub gives freelancers the visibility, opportunity, and tools 
          to grow their careers and earn on their own terms.
        </p>
      </section>

      <section className="about-grid">
        <div className="about-card">
          <FaLaptopCode className="about-icon" />
          <h3>Endless Projects</h3>
          <p>
            Browse hundreds of projects daily across every skill category 
            and start earning instantly.
          </p>
        </div>

        <div className="about-card">
          <FaMoneyCheckAlt className="about-icon" />
          <h3>Guaranteed Payments</h3>
          <p>
            No more chasing clients. Money is secured first and released 
            after successful delivery.
          </p>
        </div>

        <div className="about-card">
          <FaBolt className="about-icon" />
          <h3>Quick Bidding</h3>
          <p>
            Place bids easily with an optimized proposal system built to help 
            you win more work.
          </p>
        </div>

        <div className="about-card">
          <FaChartLine className="about-icon" />
          <h3>Grow Your Career</h3>
          <p>
            Build a strong profile, earn ratings, and get recommended to 
            high-paying clients.
          </p>
        </div>
      </section>

      <section className="mission">
        <h2>Our Vision</h2>
        <p>
          To empower freelancers with a fair, transparent, and high-opportunity
          marketplace where talent thrives without limits.
        </p>
      </section>

    </div>
  );
}
