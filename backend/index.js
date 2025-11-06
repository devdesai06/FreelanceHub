
import express, { json } from 'express'
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
app.use(cors({origin: 'http://localhost:3000',credentials:true}));
app.use(cookieParser());
//routing middleware
app.use(json());   
app.use('/api/user',userRoutes)
app.use('/api/project',projectRoutes)
app.use('/api/bid',bidRoutes)

//database connection
try{
    mongoose.connect(process.env.MONGO_URL)
    console.log("Connected to MongoDB ")

}catch(err){
    console.log("Error message: ",err)
}

app.listen(PORT,()=>{
    console.log(`Server running on port - ${PORT}`)
})
