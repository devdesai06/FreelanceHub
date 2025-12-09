import React, { useContext } from "react";
import "../../styles/FreelancerProfile.css";
import { AppContext } from '../../context/Appcontext';
import { useNavigate } from "react-router-dom";

export default function FreelancerProfile() {
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();

  // FIRST LETTER AVATAR
  const avatarLetter = userData?.name?.charAt(0)?.toUpperCase();

  // If your backend sends: userData.projects = [{title, description}, ...]
  const projects = userData?.projects || [];

  return (
    <div className="fp-wrapper">

      {/* Back Button */}
      <button className="back-arrow" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* Top Profile Section */}
      <section className="fp-top">

        {/* Avatar */}
        <div className="fp-avatar">{avatarLetter}</div>

        <h1 className="fp-name">{userData?.name}</h1>
        <p className="fp-title">
          {userData?.skills?.join(" • ") || "Freelancer"}
        </p>

        <div className="fp-stats">
          <div className="fp-stat">
            <div className="fp-value">
              {userData?.completedProjects || 0}
            </div>
            <div className="fp-label">Completed</div>
          </div>
        </div>

        <p className="fp-about">
          {userData?.bio ||
            "No bio added yet. Update your profile to tell clients more about yourself!"}
        </p>
      </section>

      {/* Projects Section */}
      <section className="fp-projects">
        <h2 className="fp-section-title">Projects</h2>

        <div className="fp-grid">
          {projects.length === 0 ? (
            <p className="fp-no-projects">No projects added yet.</p>
          ) : (
            projects.map((p, index) => (
              <div className="fp-card" key={index}>
                <h3 className="fp-card-title">{p.title}</h3>
                {p.description && (
                  <p className="fp-card-desc">{p.description}</p>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
