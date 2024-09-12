import express from "express";
import blogRoutes from "./routes/blogRoutes.js"
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import connectDB from "./config/db.js"; 


dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

// Connect to the DB
connectDB();

/* TODO: Enable cors or limiter
 app.use(cors({
  origin: 'https://touchMeAndIllSue.com', // Only allow your frontend URL
  methods: 'GET,POST,PUT,DELETE',
})); */

// Get all posts (public)  
app.use('/public', blogRoutes)


// Use the auth routes for registration and login
app.use('/auth', authRoutes); 

// Protected Admin route
app.use('/admin/blogs', blogRoutes);


// Listen
app.listen(PORT, () => {
    console.log(`App is running on PORT ${PORT}`);
});