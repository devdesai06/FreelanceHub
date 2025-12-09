import React, { useContext, useState } from "react";
import "../../styles/FreelancerSettings.css";
import { AppContext } from "../../context/Appcontext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function FreelancerSettings() {
  const { userData, setUserData, backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [name, setName] = useState(userData?.name || "");
  const [bio, setBio] = useState(userData?.bio || "");

  const handleSave = async () => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/user/update-profile`,
        { name, bio },
        { withCredentials: true }
      );

      if (data.success) {
        setUserData(data.user);

        toast.success("Profile updated successfully!", { theme: "colored" });
      }
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div className="fs-wrapper">

      {/* Back Button */}
      <button className="fs-back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h2 className="fs-title">Freelancer Settings</h2>

      <div className="fs-card">
        <label className="fs-label">Full Name</label>
        <input
          type="text"
          className="fs-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="fs-label">Bio</label>
        <textarea
          className="fs-textarea"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows="5"
        ></textarea>

        <button className="fs-save-btn" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
}
