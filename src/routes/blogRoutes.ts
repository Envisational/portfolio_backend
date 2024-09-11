import express from 'express';
import { getPublicBlogs, createBlog, updateBlog, deleteBlog } from '../controllers/blogController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/blogs', getPublicBlogs);
router.post('/', authMiddleware, createBlog);
router.put('/:id', authMiddleware, updateBlog);
router.delete('/:id', authMiddleware, deleteBlog);

export default router;