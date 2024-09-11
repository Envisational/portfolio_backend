import { Request, Response } from 'express';
import User from '../models/User.js'; 
import jwt from 'jsonwebtoken';


// Register Route
export const registerUser =  async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ email, password });
    await user.save();

    const payload = { userId: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({'Server error': err});
  }
};

// Login Route
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { userId: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({'Server error': err});
  }
};
