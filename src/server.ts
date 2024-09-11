import express from "express";
import { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import authMiddleware from "./middlewares/authMiddleware.js"; 
import authRoutes from './routes/authRoutes.js'; 

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

// Connect to the DB
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection failed", err);
    }
}
await connectDB();

// Use the auth routes for registration and login
app.use('/auth', authRoutes); 

// TEST API
app.get('/', (req: Request, res: Response) => {
    res.send("API is running!");
});

// Protected Admin route
app.post('/admin/blogs', authMiddleware, (req: Request, res: Response) => {
    res.send("Admin blog management route");
});

// Listen
app.listen(PORT, () => {
    console.log(`App is running on PORT ${PORT}`);
});
