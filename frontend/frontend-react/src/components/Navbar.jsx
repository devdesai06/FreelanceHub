import React, { useContext } from 'react';
import '../styles/Navbar.css';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/Appcontext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
function Navbar() {
  const {
    userData,
    setIsLoggedIn, setUserData
  } = useContext(AppContext)
  const navigate = useNavigate()
  const logout = async () => {
    try {
      const { data } = await axios.post(`http://localhost:5000/api/user/logout`,{},{withCredentials:true})
      data.success && setUserData(null);
      data.success && setIsLoggedIn(false);
      toast.success("Logged out successfully!", { theme: "colored" });
      navigate('/')
    }
    catch (err) {

    }
  }
  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-left">
        <h2 className="navbar-title">FreelanceHub</h2>
      </div>

      {/* Center Links */}
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/explore">Explore</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>

      {/* Right Buttons */}
      <div className="navbar-right">
        {!userData ?
          <>
            <Link to="/login" className="signin-btn">Sign In</Link>
            <Link to="/register" className="join-btn">Join</Link>
          </>
          :
          <>

            <div className="user_dropdown">
              <div className="user_settings">
                {userData?.name?.[0]?.toUpperCase()}
              </div>

              <div className="dropdown_menu">
                <Link to="/profile">Profile</Link>
                <Link to="/settings">Settings</Link>
                <button onClick={logout}>Logout</button>
              </div>
            </div>



          </>}

      </div>
    </nav>
  );
}

export default Navbar;
