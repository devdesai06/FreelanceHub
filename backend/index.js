import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";

import userRoutes from "./routes/user.route.js";
import projectRoutes from "./routes/project.route.js";
import bidRoutes from "./routes/bid.route.js";

config(); // ✅ Load env variables

const app = express();
const PORT = process.env.PORT; // ✅ Render provides its own PORT

// ✅ TRUST PROXY (IMPORTANT FOR RENDER + RATE LIMIT)
app.set("trust proxy", 1);

// ✅ CORS CONFIG (LOCAL + VERCEL)
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://freelance-hub-hmju.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

console.log("🔥🔥🔥 SEND OTP FUNCTION EXECUTED — NEW VERSION");


// ✅ RATE LIMIT (SAFE FOR PRODUCTION)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ✅ MIDDLEWARES
app.use(cookieParser());
app.use(express.json());

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("✅ FreelanceHub Backend is Live!");
});

// ✅ ROUTES
app.use("/api/user", userRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/bid", bidRoutes);

// ✅ DATABASE CONNECTION
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

connectDB();

// ✅ START SERVER
app.listen(PORT, () => {
  console.log(`✅ Server running on port - ${PORT}`);
});
