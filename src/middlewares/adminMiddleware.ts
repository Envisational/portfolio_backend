/*
import { AuthRequest } from "./authMiddleware.js";
import { NextFunction, Response } from "express";

// Sample Admin auth middleware
const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Can replace req user role with a DB query 
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };

export default adminMiddleware;
*/
