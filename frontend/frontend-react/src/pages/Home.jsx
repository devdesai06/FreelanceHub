import React, { useContext, useEffect } from "react";
import "../styles/Home.css";
import { AppContext } from "../context/Appcontext";
import ClientHome from "./Client/ClientHome";
import FreelancerHome from "./Freelancer/FreelancerHome";
import Navbar from "../components/Navbar";

const Home = () => {
  const { userData } = useContext(AppContext);

  const images = [
    '/assests.jpg',
    '/assests2.jpg',
    '/assests3.jpg',
    '/assests4.webp',
    '/assests5.webp',
  ]
  const randomImage=Math.floor(Math.random()*images.length)
  useEffect(() => {
    const elements = document.querySelectorAll(".fade-up");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("active");
        });
      },
      { threshold: 0.1 }
    );
    elements.forEach((el) => observer.observe(el));
  }, []);

  if (!userData) {
    return (
      <div className="landing">
        <Navbar />
        <br />
        <section className="hero fade-up">
          <div className="hero-content">
            <h1>Bid. Work. Earn.</h1>
            <p>
              FreelanceHub connects clients and freelancers through a simple bidding system.
              Post a project, place a bid, and start working once you’re matched.
            </p>
            <a href="/register" className="cta-btn">Get Started</a>
          </div>
          <div className="hero-img">
            <img src={images[randomImage]} alt="" />
          </div>
        </section>

        <section className="categories fade-up" id="explore">
          <h2>Popular Categories</h2>
          <div className="category-grid">
            <div className="category-card">Web Development</div>
            <div className="category-card">Graphic Design</div>
            <div className="category-card">Digital Marketing</div>
            <div className="category-card">Video Editing</div>
            <div className="category-card">Content Writing</div>
            <div className="category-card">App Development</div>
          </div>
        </section>

        <section className="how-it-works fade-up">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <h3>1. Post or Find a Project</h3>
              <p>Clients share what they need. Freelancers explore and place fair bids.</p>
            </div>
            <div className="step">
              <h3>2. Chat & Collaborate</h3>
              <p>Once matched, both sides can chat easily to discuss details and share progress.</p>
            </div>
            <div className="step">
              <h3>3. Deliver & Get Paid</h3>
              <p>Submit work, approve results, and complete secure payments — all in one place.</p>
            </div>
          </div>
        </section>

        <section className="why-choose fade-up">
          <h2>Why FreelanceHub?</h2>
          <div className="reasons">
            <div className="reason">
              <h3>Bidding First</h3>
              <p>Our platform is centered around fair, transparent bidding — the best work wins.</p>
            </div>
            <div className="reason">
              <h3>Built-in Chat</h3>
              <p>Communicate clearly, share updates, and finalize details — all without distractions.</p>
            </div>
            <div className="reason">
              <h3>Secure Payments</h3>
              <p>Fast, safe, and reliable payment system for both clients and freelancers.</p>
            </div>
          </div>
        </section>

        <footer className="footer fade-up">
          <p>© {new Date().getFullYear()} FreelanceHub — Where Bidding Turns Into Real Work</p>
        </footer>
      </div>
    );
  }

  if (userData.role === "client") return <ClientHome />;
  if (userData.role === "freelancer") return <FreelancerHome />;

  return (
    <div>
      <Navbar />
      <h2>Loading user dashboard...</h2>
    </div>
  );
};

export default Home;
