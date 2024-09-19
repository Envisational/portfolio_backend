import express from "express";
import blogRoutes from "./routes/blogRoutes.js"
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import connectDB from "./config/db.js";
import cors from "cors"; 


dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

// Connect to the DB
try {
  connectDB();
} catch (err) {
  console.log(err);
}


 app.use(cors({
  origin: 'http://localhost:3000',
 })); 

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

export default app;