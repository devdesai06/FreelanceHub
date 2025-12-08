import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { AppContext } from "../../context/Appcontext";
import "../../styles/FreelancerProjectView.css";

export default function FreelancerProjectView() {
  const { projectId } = useParams();
  const { backendUrl } = useContext(AppContext);

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/api/project/getProjectById/${projectId}`
        );
        setProject(res.data.project);
      } catch (err) {
        console.log("Error loading project:", err);
      }
      setLoading(false);
    };
    fetchProject();
  }, [backendUrl, projectId]);

  if (loading) return <p className="loading">Loading...</p>;

  if (!project) return <p className="loading">Project not found.</p>;

  return (
    <div className="freelancer-project-view">
      <Navbar />
      <br />
      <br />
      <div className="container">
        <h1>{project.title}</h1>

        <p className="description">{project.description}</p>

        <div className="details-box">
          <p>
            <strong>Budget:</strong> ₹ {project.budget}
          </p>
          <p>
            <strong>Status:</strong> {project.status}
          </p>
          <p>
            <strong>Client:</strong> {project.createdBy?.name}
          </p>
        </div>
      </div>
    </div>
  );
}
