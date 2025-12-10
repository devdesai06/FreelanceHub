import { User } from "../models/model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";

// ===================================================
// REGISTER
// ===================================================
export const UserSignUp = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: "User data not found" });
    }

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res.status(400).json({ success: false, message: "User already exists. Login" });
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedpassword,
      isVerified: false,
      role,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ===================================================
// SEND OTP USING BREVO API
// ===================================================
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
console.log("🔥🔥🔥 SEND OTP FUNCTION EXECUTED — NEW VERSION");

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: "User already verified" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "FreelanceHub", email: "devdesai8790@gmail.com" }, 
        to: [{ email }],
        subject: "Verify Your Email - FreelanceHub",
        htmlContent: `
          <div>
            <h2>Email Verification</h2>
            <p>Your OTP is:</p>
            <h1>${otp}</h1>
            <p>This OTP is valid for 10 minutes.</p>
          </div>
        `,
      }),
    });

    if (!brevoResponse.ok) {
      const errText = await brevoResponse.text();
      throw new Error(`Brevo Error: ${errText}`);
    }

    return res.status(200).json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (err) {
    console.error("OTP Send Error:", err);
    return res.status(500).json({
      success: false,
      message: "OTP sending failed",
      error: err.message,
    });
  }
};

// ===================================================
// VERIFY EMAIL
// ===================================================
export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: "User already verified" });
    }

    if (user.otp !== parseInt(otp)) {
      return res.status(400).json({ success: false, message: "Wrong OTP" });
    }

    if (Date.now() > user.otpExpiry) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ===================================================
// LOGIN
// ===================================================
export const UserSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ "Error in Login": error.message });
  }
};

// ===================================================
// LOGOUT
// ===================================================
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    return res.json({ success: true, message: "Logged Out" });
  } catch (err) {
    res.status(400).json({ success: false, message: `Error in logout:${err}` });
  }
};

// ===================================================
// GET PROFILE
// ===================================================
export const getprofile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password -otp -otpExpiry");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in getting profile",
      error: error.message,
    });
  }
};

// ===================================================
// AUTH CHECK
// ===================================================
export const isAuthenticated = async (req, res) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.json({ success: false, message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    return res.json({ success: true, userId: decoded.id });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error checking authentication" });
  }
};

// ===================================================
// UPDATE PROFILE
// ===================================================
export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, bio } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Name cannot be empty",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, bio: bio || "" },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating profile",
    });
  }
};
