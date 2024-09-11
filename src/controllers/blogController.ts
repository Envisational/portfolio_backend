import {Request, Response} from "express";
import Blog from "../models/Blog.js";
import {AuthRequest} from "../middlewares/authMiddleware.js";


// Fetch public blog posts
export const getPublicBlogs = async (req: Request, res: Response) => {
    try {
      const blogs = await Blog.find().sort({ createdAt: -1 });
      res.status(200).json(blogs);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  

// Create a new blog post (admin)
export const createBlog = async (req: AuthRequest, res: Response) => {
    const {title, content} = req.body;
    try {
        const blog = new Blog({
            title, 
            content,
            author: req.user.userId
        });

        await blog.save();
        res.status(201).json({ 'Blog saved': blog });

    } catch(err) {
        return res.status(500).json({ message: 'Failed to create. Server error. Big doink', err });
    };
};


// Update an existing blog (admin)
export const updateBlog = async(req: AuthRequest, res: Response) => {
    const {title, content} = req.body;
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id);
        if(!blog) return res.status(404).json({ message: 'Blog not found doinky' });

        blog.title = title || blog.title;
        blog.content = content || blog.content;

        await blog.save();
        res.status(200).json({'blog updated': blog});
    } catch(err) {
        return res.status(500).json({ message: 'Failed to edit. Server error', err });
    };
};

// Delete a blog (admin)
export const deleteBlog = async (req: AuthRequest, res: Response) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found doinky' });

        res.status(200).json({ message: 'Blog deleted' })

    } catch(err) {
        return res.status(500).json({ message: 'Failed to delete. Server error', err });
    }
};
