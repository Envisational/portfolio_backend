import { contextsKey } from "express-validator/lib/base.js";
import mongoose, {Schema, Document} from "mongoose";

export interface Iblog extends Document {
    title: string,
    content: string,
    author: string;
    createdAt: Date,
    updatedAt: Date
}

const blogSchema: Schema = new mongoose.Schema({
    title:{type: String, required: true},
    content: {type: String, required: true},
    author: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

// Automatically update 'updatedAt' on save
blogSchema.pre('save', async function (next) {
    this.updatedAt = new Date();
    next();
});

const Blog = mongoose.model<Iblog>('Blog', blogSchema);
export default Blog;