import { User } from "../models/model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

//Register
export const UserSignUp = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res
        .status(404)
        .json({ success: false, message: "User data not found" });
    }
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists. Login " });
    }
    const hashedpassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedpassword,
      isVerified: false,
      role,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // ✅ required for cross-origin cookies in Chrome
      sameSite: "none", // ✅ required for localhost:5173 <-> 5000
      path: "/", // send cookie to all routes
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "User already verified" });
    }

    //  Generate and save OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    //  Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "devdesai8790@gmail.com",
        pass: process.env.gmailAppPass,
      },
    });

    //  Send email
    await transporter.sendMail({
      from: '"FreelanceHub" <devdesai8790@gmail.com>',
      to: email,
      subject: "Verify Your Email Address - FreelanceHub",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #f8f8f8; padding: 20px; text-align: center; border-bottom: 2px solid #007bff;">
              <h2 style="margin: 0; color: #007bff;">FreelanceHub</h2>
          </div>
          <div style="padding: 30px;">
              <p>Hello User,</p>
              <p>Thank you for signing up with FreelanceHub. Your OTP is below:</p>
              <div style="text-align: center; margin: 30px 0; padding: 15px; background-color: #e9f5ff; border: 1px dashed #007bff; border-radius: 4px;">
                  <h1 style="font-size: 32px; color: #d9534f; letter-spacing: 5px;">${otp}</h1>
              </div>
              <p style="text-align:center;color:#777;">Expires in 10 minutes.</p>
          </div>
          <div style="background-color: #f0f0f0; padding: 20px; font-size: 12px; text-align: center; color: #555;">
              <p>If you didn’t request this verification, ignore this email.</p>
          </div>
        </div>
      `,
    });

    // Single response only
    return res.status(200).json({
      success: true,
      message: "Verification email sent successfully!",
      otp, // remove in production
    });
  } catch (err) {
    console.error("OTP Send Error:", err);
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        error: err.message,
      });
  }
};

//verifyEmail
export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });

    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "User already verified" });
    }

    if (user.otp !== parseInt(otp)) {
      return res.status(400).json({ success: false, message: "Wrong OTP" });
    }

    if (Date.now() > user.otpExpiry) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    // ✅ Update user as verified
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // ✅ Automatically log them in by setting JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // ✅ required for cross-origin cookies in Chrome
      sameSite: "none", // ✅ required for localhost:5173 <-> 5000
      path: "/",

      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ success: true, message: "Email verified successfully!" });
  } catch (error) {
    console.error("Verify email error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

//Login
export const UserSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // ✅ required for cross-origin cookies in Chrome
      sameSite: "none", // ✅ required for localhost:5173 <-> 5000
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      message: "Login successfull",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(404).json({ "Error in Login": error.message });
  }
};
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true, // ✅ required for cross-origin cookies in Chrome
      sameSite: "none", // ✅ required for localhost:5173 <-> 5000
      path: "/",
    });

    return res.json({ success: true, message: "Logged Out" });
  } catch (err) {
    res.status(400).json({ success: false, message: `Error in logout:${err}` });
  }
};
//getprofile
export const getprofile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "-password -otp -otpExpiry"
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
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

export const isAuthenticated = async (req, res) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.json({ success: false, message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    return res.json({ success: true, userId: decoded.id });
  } catch (error) {
    console.error("Auth Check Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error checking authentication" });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId; // from authMiddleware
    const { name, bio } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Name cannot be empty.",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, bio: bio || "" },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.log("Update Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating profile.",
    });
  }
};
