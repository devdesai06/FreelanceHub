import React, { useContext } from 'react';
import '../../styles/FreelancerHome.css';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { AppContext } from '../../context/Appcontext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const FreelancerHome = () => {
  const { userData, isLoggedIn } = useContext(AppContext);

  return (
    <div className="home">
      <Navbar />
      <section className="hero">
        <div className="hero-content">
          <h1>
            Hey, <span>{userData?.name || 'Freelancer'}</span>
          </h1>
          <p>Connect, Collaborate, and Grow — All in One Platform.</p>

          <div className="hero-buttons">
            <h1>Find projects that match your skills and start earning today!</h1>
          </div>
          <div className="browseprojects-btn">
            <Link to="/browseProjects" className="browse-btn">
              <FontAwesomeIcon icon={faSearch} /> Browse Projects
            </Link>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="how-it-works">
        <h2>HOW IT WORKS</h2>
        <div className="steps">
          <div className="step-card">
            <img src="/icons/search-engine.png" alt="Browse Projects" />
            <h3>BROWSE PROJECTS</h3>
            <div className="underline"></div>
            <p>Explore a wide range of client-posted projects that match your skills and interests.</p>
          </div>

          <div className="step-card">
            <img src="/icons/hammer.png" alt="Place Bids" />
            <h3>PLACE BIDS</h3>
            <div className="underline"></div>
            <p>Submit detailed proposals with your estimated cost, timeline, and a short pitch explaining why you’re the best fit.</p>
          </div>

          <div className="step-card">
            <img src="/icons/hand-shake.png" alt="Get Hired" />
            <h3>GET HIRED</h3>
            <div className="underline"></div>
            <p>Once the client reviews your bid, get hired to start working. Communicate clearly and set milestones for success.</p>
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

export default FreelancerHome;
