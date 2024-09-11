import mongoose from "mongoose";
import exp from "node:constants";
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection failed", err);
    }
};


export default connectDB;