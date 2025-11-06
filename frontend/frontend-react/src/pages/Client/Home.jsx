import React from 'react';
import '../../styles/Home.css';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useContext } from 'react';
import { AppContext } from '../../context/Appcontext';
const Home = () => {
  const { userData } = useContext(AppContext)
  return (
    <div className="home">
      <Navbar />
      <section className="hero">
        <div className="hero-content">
          {userData?.name ? (
            <h1>Hey, <span>{userData.name}</span></h1>
          ) : (
            <h1>Welcome to <span>FreelanceHub</span></h1>
          )}

          <p>Connect, Collaborate, and Grow — All in One Platform.</p>
          <div className="hero-buttons">
            {!userData ? <>
              <Link to="/login" className="btn-primary">Login</Link>
              <Link to="/register" className="btn-secondary">Get Started</Link>
            </>
              :
              <>
                <h1>Find the perfect freelance services for you !! </h1>
              </>
            }
          </div>
        </div>
      </section>

      {/* Features Section */}
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

      {/* Call to Action */}
      <section className="cta">
        <h2>Join FreelanceHub Today!</h2>
        <p>Start your journey towards smarter freelancing now.</p>
        <Link to="/register" className="btn-primary">Join Now</Link>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} FreelanceHub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
