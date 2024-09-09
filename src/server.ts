import express from "express";
import { Request, Response } from "express"
import mongoose from "mongoose";
import dotenv from 'dotenv'
import { json } from "stream/consumers";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

// Connect to the DB
await mongoose.connect(process.env.MONGO_URI!)
.then(() => {
    console.log("MongoDB connected");
})
.catch((err) => {
    console.log("MongoDB connection failed", err);
});

// TEST API
app.get('/', (req: Request, res: Response) => {
    res.send("API is running to have fun your mom");
});

// Listen
app.listen(PORT, () => {
    console.log(`App is running on PORT ${PORT}`);
});
