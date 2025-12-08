import React, { useState, useContext } from "react";
import "../../styles/Login.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { AppContext } from "../../context/Appcontext";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { backendUrl, getUserData, setIsLoggedIn } = useContext(AppContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/login`,
        { email, password },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("Login successful!", { theme: "colored" });
        setTimeout(async () => {
          await getUserData();
          setIsLoggedIn(true);
        }, 500);

        navigate("/");
      } else {
        toast.error(data.message, { theme: "colored" });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed!", { theme: "colored" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Navbar />
      <div className="login-container">
        <form className="login-box" onSubmit={handleLogin}>
          <h2>Welcome Back</h2>
          <p className="subtitle">Log in to your FreelanceHub account</p>

          <input
            type="email"
            placeholder="Email Address"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? "Signing In..." : "Login"}
          </button>

          <p className="signup-link">
            Don’t have an account? <a href="/register">Join Now</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
