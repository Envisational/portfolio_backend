import express from "express";
import { Request, Response } from "express";
import blogRoutes from "./routes/blogRoutes.js"
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import connectDB from "./config/db.js"; 
import Blog from "./models/Blog.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

// Connect to the DB
await connectDB();


// Get all posts (public) TODO: Enable cors or limiter 
app.get('/public', async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }); // Sort by newest
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get blogs. Details:', error });
  }
});


// Use the auth routes for registration and login
app.use('/auth', authRoutes); 

// Protected Admin route
app.use('/admin/blogs', blogRoutes);


// Listen
app.listen(PORT, () => {
    console.log(`App is running on PORT ${PORT}`);
});