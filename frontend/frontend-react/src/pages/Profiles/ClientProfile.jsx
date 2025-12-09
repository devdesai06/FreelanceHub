import React, { useContext } from "react";
import "../../styles/ClientProfile.css";
import { AppContext } from "../../context/Appcontext";
import { useNavigate } from "react-router-dom";

export default function ClientProfile() {
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();

  const avatarLetter = userData?.name?.charAt(0)?.toUpperCase();
  const postedProjects = userData?.projects?.length || 0;
  const completedProjects = userData?.completed || 0;

  return (
    <div className="cp-wrapper">

      {/* Back Button */}
      <button className="cp-back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* Top Section */}
      <section className="cp-top">
        <div className="cp-avatar">{avatarLetter}</div>

        <h1 className="cp-name">{userData?.name}</h1>
        <p className="cp-role">Client</p>

        {/* Stats */}
        <div className="cp-stats">
          <div className="cp-stat">
            <div className="cp-value">{postedProjects}</div>
            <div className="cp-label">Posted</div>
          </div>

          <div className="cp-stat">
            <div className="cp-value">{completedProjects}</div>
            <div className="cp-label">Completed</div>
          </div>
        </div>

        {/* Bio */}
        <p className="cp-bio">
          {userData?.bio && userData.bio.trim() !== ""
            ? userData.bio
            : "No bio added yet. Update your profile to tell freelancers more about your business!"}
        </p>
      </section>

      {/* Projects Section */}
      <section className="cp-projects">
        <h2 className="cp-section-title">Projects</h2>

        <div className="cp-grid">
          {postedProjects === 0 ? (
            <p className="cp-no-projects">No projects posted yet.</p>
          ) : (
            userData?.projects?.map((p, index) => (
              <div className="cp-card" key={index}>
                <h3 className="cp-card-title">{p.title}</h3>
                <p className="cp-card-desc">{p.description}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
