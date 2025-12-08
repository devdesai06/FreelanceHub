import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/ClientHome.css';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { AppContext } from '../../context/Appcontext';
import { toast } from 'react-toastify';
import axios from 'axios';
const ClientHome = () => {
const navigate=useNavigate();
  const categories = [
    "Web Development",
    "Mobile Apps",
    "Full Stack Development",
    "Graphic Design",
    "UI/UX Design",
    "Logo Design",
    "Video Editing",
    "Content Writing",
    "SEO",
    "Social Media Marketing",
    "AI / Machine Learning",
    "Data Science",
    "Data Entry",
  ];
  const { backendUrl, userData, isLoggedIn } = useContext(AppContext);
  const [showForm, setshowForm] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  const [projects, setprojects] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
    category: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(`${backendUrl}/api/project/createProject`,
        formData, { withCredentials: true }
      )
      if (data.success) {
        toast.success("Project posted successfully!");
        setshowForm(false);
        setFormData({ title: "", description: "", budget: "", deadline: "", category: "" });
        getProjects();
      }
    }
    catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }

  }
  const getProjects = async (e) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/project/getProjectsByUser`, { withCredentials: true });
      if (data.success) {
        setprojects(data.projects)
      }
    }
    catch (err) {
      toast.error(err.response?.data?.message ||
        err.message ||
        "Something went wrong. Please try again.")
    }
  }
  useEffect(() => {

    getProjects();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);


  return (
    <div className="client-home">
      <Navbar />

      <section className="hero">
        <div className="hero-content">
          <h1>
            Hey, <span>{userData?.name || 'Client'}</span>
          </h1>
          <p>Connect, Collaborate, and Grow — All in One Platform.</p>

          <div className="hero-buttons">
            <h1>Find the perfect freelance services for you !!</h1>
          </div>
          <button className="post-btn" onClick={() => setshowForm(true)}>
            + Post a Project
          </button>
        </div>
      </section>
      {showForm && (
        <div className="overlay">
          <div className="post-modal">
            <h2>Post a New Project</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Project title"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <textarea
                name="description"
                placeholder="Project description"
                value={formData.description}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="budget"
                placeholder="Budget (₹)"
                value={formData.budget}
                onChange={handleChange}
                required
              />
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
              />

              <select

                name="category"
                onChange={handleChange}
                value={formData.category}
                className="category-dropdown"
              >

                <option value="">
                  Select Category
                </option>
                {
                  categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>

                  ))
                }
              </select>
              <div className="modal-actions">
                <br />
                <button type="submit" className="btn-primary">
                  Post Project
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setshowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <section>
        <div className="show-projects">
          <h1>Your Projects</h1>
          <div className="projects">
            {projects.length > 0 ? (
              <ul>
                {projects.map((project) => (
                  <li key={project._id} className="project-card" onClick={()=>navigate(`/seeProject/${project._id}`)}>
                    <h3  >{project.title}</h3>
                    <p>{project.description}</p>
                    <p><strong>Budget:</strong> ₹{project.budget}</p>
                    <p><strong>Deadline:</strong> {project.deadline || 'N/A'}</p>
                    <p><strong>Status:</strong> {project.status}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-projects">You haven’t posted any projects yet.</p>
            )}
          </div>
        </div>
      </section>
      {/* HOW IT WORKS SECTION */}
      <section className="how-it-works">
        <h2>HOW IT WORKS</h2>
        <div className="steps">
          <div className="step-card">
            <img src="/icons/write.png" alt="Post Project" />
            <h3>POST A PROJECT</h3>
            <div className="underline"></div>
            <p>Share your project details and let freelancers know what you need. The more specific, the better the matches!</p>
          </div>

          <div className="step-card">
            <img src="/icons/bubble-chat.png" alt="Bid & Proposals" />
            <h3>RECEIVE BIDS</h3>
            <div className="underline"></div>
            <p>Freelancers will send you proposals with timelines and prices. Review profiles, ratings, and portfolios before choosing.</p>
          </div>

          <div className="step-card">
            <img src="/icons/lock.png" alt="Hire Freelancer" />
            <h3>HIRE SECURELY</h3>
            <div className="underline"></div>
            <p>Select the best freelancer for your project and make a secure payment through FreelanceHub’s SafePay system.</p>
          </div>

          <div className="step-card">
            <img src="/icons/check.png" alt="Collaborate" />
            <h3>COLLABORATE & COMPLETE</h3>
            <div className="underline"></div>
            <p>Chat, share files, and track progress directly on FreelanceHub. Release payment when you’re fully satisfied with the work.</p>
          </div>
        </div>
      </section>

      {!isLoggedIn && (
        <section className="cta">
          <h2>Join FreelanceHub Today!</h2>
          <p>Start your journey towards smarter freelancing now.</p>
          <Link to="/register" className="btn-primary">Join Now</Link>
        </section>
      )}

      <footer className="footer">
        <p>© {new Date().getFullYear()} FreelanceHub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ClientHome;
