import { rateLimit } from 'express-rate-limit'
import express from 'express'
import { config } from 'dotenv'
import  mongoose  from 'mongoose'
config()
const app = express()
const PORT = process.env.PORT || 3000;

import userRoutes from './routes/user.route.js'
import projectRoutes from './routes/project.route.js'
import bidRoutes from './routes/bid.route.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://freelance-hub-hmju.vercel.app" // ✅ YOUR VERCEL FRONTEND
    ],
    credentials: true
  })
);

const limiter=rateLimit({
  windowMs: 15 * 60 * 1000,
  limit:100,
})
app.use(limiter)
app.get("/", (req, res) => {
  res.send("✅ FreelanceHub Backend is Live!");
});


app.use(cookieParser());
//routing middleware
app.use(express.json());   
app.use('/api/user',userRoutes)
app.use('/api/project',projectRoutes)
app.use('/api/bid',bidRoutes)




//database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log("Connected to MongoDB")
  } catch (err) {
    console.error("MongoDB connection failed:", err.message)
    process.exit(1)
  }
}

connectDB()


app.listen(PORT,()=>{
    console.log(`Server running on port - ${PORT}`)
})
