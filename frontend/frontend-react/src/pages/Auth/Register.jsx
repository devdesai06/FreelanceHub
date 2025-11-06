import React, { useContext, useState } from "react";
import '../../styles/SignUp.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/Appcontext";

function Register() {
  const [name, setname] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [otpsent, setotpsent] = useState(false);
  const [otp, setotp] = useState('');
  const [Loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const {
    //  userData,
    //   isLoggedIn,
    setIsLoggedIn,
    // setUserData,
    getUserData,
  } = useContext(AppContext)
  // --- Register User ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`http://localhost:5000/api/user/register`, {
        name,
        email,
        password,
      });

      if (data.success) {
        // send otp
        const otpResponse = await axios.post(`http://localhost:5000/api/user/sendOtp`, { email });
        if (otpResponse.data.success) {
          toast.success(otpResponse.data.message, { theme: "colored" });
          setotpsent(true);
        } else {
          toast.error(otpResponse.data.message, { theme: "colored" });
        }
      } else {
        toast.error(data.message, { theme: "colored" });
      }
    } catch (err) {
     toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false)
    }
  };

  // --- Verify OTP ---
  const handleVerify = async (e) => {
    axios.defaults.withCredentials = true;
    e.preventDefault();
    try {
      const { data } = await axios.post(`http://localhost:5000/api/user/verifyEmail`, {
        email,
        otp,
      });

      if (data.success) {

        if (data.success) {
          toast.success("Email verified successfully!", { theme: "colored" });

          setTimeout(async () => {
            await getUserData();
            setIsLoggedIn(true);
            navigate('/');
          }, 500);
        }

      } else {
        toast.error(data.message, { theme: "colored" });
      }
    } catch (err) {
      console.log(err);
      toast.error("Invalid or expired OTP!", { theme: "colored" });
    }
  };

  return (
    <div className="signup-container">
      {!otpsent ? (
        <>
          <form className="signup-box" onSubmit={handleSubmit}>
            <h2>Create Account</h2>
            <p className="subtitle">Join FreelanceHub and start your journey!</p>

            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={(e) => setname(e.target.value)}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email address"
              onChange={(e) => setemail(e.target.value)}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Create password"
              onChange={(e) => setpassword(e.target.value)}
              required
            />

            <button type="submit" className="btn">{Loading ? 'Loading...' : 'Sign Up'}</button>

            <p className="login-link">
              Already have an account? <a href="/login">Login</a>
            </p>
          </form>
        </>
      ) : (
        <>
          <form className="signup-box" onSubmit={handleVerify}>
            <h2>Verify Your Email</h2>
            <p className="subtitle">We’ve sent an OTP to your email: <strong>{email}</strong></p>

            <input
              type="text"
              name="otp"
              autoComplete=""
              placeholder="Enter OTP"
              onChange={(e) => setotp(e.target.value)}
              required
            />

            <button type="submit" className="btn">Verify OTP</button>

            <p className="login-link">
              Didn’t receive the OTP?{" "}
              <span
                className="resend"
                onClick={async () => {
                  try {
                    const resend = await axios.post(`http://localhost:5000/api/user/sendOtp`, { email });
                    if (resend.data.success) {
                      toast.success("OTP resent successfully!", { theme: "colored" });
                    } else {
                      toast.error(resend.data.message, { theme: "colored" });
                    }
                  } catch (err) {
                    toast.error("Failed to resend OTP", { theme: "colored" });
                  }
                }}
                style={{ cursor: "pointer", color: "#007bff" }}
              >
                Resend OTP
              </span>
            </p>
          </form>
        </>
      )}
    </div>
  );
}

export default Register;
