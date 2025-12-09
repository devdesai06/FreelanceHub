import React, { useContext, useState } from "react";
import "../../styles/ClientSettings.css";
import { AppContext } from "../../context/Appcontext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ClientSettings() {
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

        toast.success("Client profile updated successfully!", { theme: "colored" });
      }
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div className="cs-wrapper">

      {/* Back Button */}
      <button className="cs-back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h2 className="cs-title">Client Settings</h2>

      <div className="cs-card">
        <label className="cs-label">Full Name</label>
        <input
          type="text"
          className="cs-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="cs-label">About You / Company Bio</label>
        <textarea
          className="cs-textarea"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows="5"
        ></textarea>

        <button className="cs-save-btn" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
}
