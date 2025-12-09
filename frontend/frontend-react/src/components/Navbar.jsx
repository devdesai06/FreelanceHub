import React, { useContext, useState } from 'react';
import '../styles/Navbar.css';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/Appcontext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Navbar() {
  const {
    backendUrl,
    userData,
    setIsLoggedIn,
    setUserData
  } = useContext(AppContext);

  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/logout`,
        {},
        { withCredentials: true }
      );

      if (data.success) {
        setUserData(null);
        setIsLoggedIn(false);
        toast.success("Logged out successfully!", { theme: "colored" });
        navigate('/');
        window.location.reload();
      }

    } catch (err) {
      toast.error(err);
    }
  };

  /* ----------------------------
        DYNAMIC ROUTES
  ---------------------------- */

  // Dynamic About
  const aboutRoute = userData
    ? userData.role === "freelancer"
      ? "/about/freelancer"
      : "/about/client"
    : null;

  // Dynamic Profile Page
  const profileRoute = userData?.role === "freelancer"
    ? "/profile/freelancer"
    : "/profile/client";

  // Dynamic Settings Page
  const settingsRoute = userData?.role === "freelancer"
    ? "/settings/freelancer"
    : "/settings/client";


  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <h2 className="navbar-title">FreelanceHub</h2>
        </div>

        {/* DESKTOP LINKS */}
        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/explore">Explore</Link></li>
          <li><Link to="/services">Services</Link></li>

          {/* Show About only when logged in */}
          {userData && (
            <li><Link to={aboutRoute}>About</Link></li>
          )}
        </ul>

        {/* RIGHT SIDE */}
        <div className="navbar-right">
          {!userData ? (
            <>
              <Link to="/login" className="signin-btn">Sign In</Link>
              <Link to="/register" className="join-btn">Join</Link>
            </>
          ) : (
            <div className="user_dropdown">
              <div className="user_settings">
                {userData?.name?.[0]?.toUpperCase()}
              </div>

              <div className="dropdown_menu">
                <Link to={profileRoute}>Profile</Link>
                <Link to={settingsRoute}>Settings</Link>
                <button onClick={logout}>Logout</button>
              </div>
            </div>
          )}

          {/* HAMBURGER */}
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(prev => !prev)}
          >
            ☰
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/explore" onClick={() => setMenuOpen(false)}>Explore</Link>
          <Link to="/services" onClick={() => setMenuOpen(false)}>Services</Link>

          {/* About (only logged in) */}
          {userData && (
            <Link to={aboutRoute} onClick={() => setMenuOpen(false)}>About</Link>
          )}

          {userData ? (
            <>
              <Link
                to={profileRoute}
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>

              <Link
                to={settingsRoute}
                onClick={() => setMenuOpen(false)}
              >
                Settings
              </Link>

              <button
                onClick={() => { logout(); setMenuOpen(false); }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>Join</Link>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Navbar;
