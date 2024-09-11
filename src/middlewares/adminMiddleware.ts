import { AuthRequest } from "./authMiddleware.js";
import { NextFunction, Response } from "express";

const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };

export default adminMiddleware;