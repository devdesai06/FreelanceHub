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
    setIsLoggedIn, setUserData
  } = useContext(AppContext)
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false);
  const logout = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/logout`, {}, { withCredentials: true })
      data.success && setUserData(null);
      data.success && setIsLoggedIn(false);
      toast.success("Logged out successfully!", { theme: "colored" });
      navigate('/')
      window.location.reload()
    }
    catch (err) {
toast.error(err)
    }
  }
  return (
    <>
    <nav className="navbar">
  <div className="navbar-left">
    <h2 className="navbar-title">FreelanceHub</h2>
  </div>

  <ul className="navbar-links">
    <li><Link to="/">Home</Link></li>
    <li><Link to="/explore">Explore</Link></li>
    <li><Link to="/services">Services</Link></li>
    <li><Link to="/about">About</Link></li>
  </ul>

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
        {userData?.role==="freelancer"?
        <>
        <Link to="/profile/freelancer">Profile</Link>
        </>
        :
        <>
        <Link to="/profile/client">Profile</Link>
        </>}
          
          
          <Link to="/settings">Settings</Link>
          <button onClick={logout}>Logout</button>
        </div>
      </div>
    )}

    {/* Hamburger */}
    <button className="menu-toggle" onClick={() => setMenuOpen(prev => !prev)}>
      ☰
    </button>
  </div>
</nav>


{menuOpen && (
  <div className="mobile-menu">
    <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
    <Link to="/explore" onClick={() => setMenuOpen(false)}>Explore</Link>
    <Link to="/services" onClick={() => setMenuOpen(false)}>Services</Link>
    <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>

    {userData ? (
      <>
       {userData?.role==="freelancer"?
        <>
        <Link to="/profile/freelancer">Profile</Link>
        </>
        :
        <>
        <Link to="/profile/client">Profile</Link>
        </>}
          
        <button onClick={() => { logout(); setMenuOpen(false); }}>Logout</button>
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
