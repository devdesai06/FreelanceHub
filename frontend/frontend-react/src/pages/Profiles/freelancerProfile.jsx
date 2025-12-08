import React, { useContext } from "react";
import "../../styles/FreelancerProfile.css";
import { AppContext } from '../../context/Appcontext';
import { useNavigate } from "react-router-dom";
export default function FreelancerProfile() {
    const { userData } = useContext(AppContext)
    const navigate = useNavigate()
    return (
        <div className="fp-wrapper">
            <button className="back-arrow" onClick={() => navigate("/")}>
                ← Back
            </button>
            {/* Top Profile Section */}
            <section className="fp-top">
                <img
                    className="fp-avatar"
                    src="https://i.pravatar.cc/150?img=12"
                    alt="freelancer"
                />

                <h1 className="fp-name">Dev Desai</h1>
                <p className="fp-title">Full-Stack Developer</p>

                <div className="fp-stats">
                    <div className="fp-stat">
                        <div className="fp-value">4.9</div>
                        <div className="fp-label">Rating</div>
                    </div>

                    <div className="fp-stat">
                        <div className="fp-value">128</div>
                        <div className="fp-label">Reviews</div>
                    </div>

                    <div className="fp-stat">
                        <div className="fp-value">342</div>
                        <div className="fp-label">Completed</div>
                    </div>
                </div>

                <p className="fp-about">
                    I build modern, fast, and clean web applications using React, Node.js,
                    and Express. Focused on delivering quality work and great user
                    experiences.
                </p>
            </section>

            {/* Projects/Gigs Section */}
            <section className="fp-projects">
                <h2 className="fp-section-title">Projects</h2>

                <div className="fp-grid">

                    <div className="fp-card">

                        <h3 className="fp-card-title">Landing Page in React</h3>
                    </div>
                </div>
            </section>
        </div>
    )
}


