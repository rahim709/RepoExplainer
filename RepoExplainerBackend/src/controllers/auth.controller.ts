// Login Logout Logic

import { Request, Response } from 'express';
import { User } from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { userName, email, password } = req.body;

    if (
      typeof email != 'string' ||
      typeof password != 'string' ||
      typeof userName != 'string'
    ) {
      res.status(400).json({ message: 'Invalid input' });
      return;
    }

    const loweredEmail = email.trim().toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      userName: userName,
      email: loweredEmail,
      password: hashedPassword,
    });
    if (user) {
      res.json({ message: 'Registered Successful' });
    }
  } catch (err: unknown) {
    if ((err as any)?.code === 11000) {
      return res.status(409).json({
        message: 'User already registered',
      });
    }

    console.error('Signup error:', err);

    return res.status(500).json({
      message: 'Some error occurred while signup. Please try again later',
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  if (config.jwtkey === '') {
    throw new Error('Token is not valid');
  }
  try {
    const { email, password } = req.body;
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({
        message: 'Invalid input types',
      });
    }
    const loweredEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: loweredEmail });
    if (!user) {
      return res.status(403).json({ message: 'Invalid email or password' });
    }

    const passwordMatched = await bcrypt.compare(password, user.password);

    if (!passwordMatched) {
      return res.status(403).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, config.jwtkey, {
      expiresIn: '1h',
    });

    res.cookie('token', token, {
      httpOnly: true, // Prevents JavaScript access (XSS protection)
      secure: true, // Only sends over HTTPS (set to false for localhost/dev)
      sameSite: 'none',
      maxAge: 3600000, // 1 hour in milliseconds
    });

    return res.status(200).json({
      message: 'User logged in successfully',
      token,
    });
  } catch (err) {
    console.error('Login error:', err);

    return res.status(500).json({
      message: 'Some error occurred while signing in, please try again',
    });
  }
};

export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true, // Use true in production (HTTPS)
    sameSite: 'none',
  });

  return res.status(200).json({ message: 'Logout successful' });
};

export const checkAuth = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userID).select('-password'); // req.userID comes from middleware
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({
      isAuthenticated: true,
      user: { userName: user.userName, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error checking auth' });
  }
};

export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const userId = req.userID;

    const user = await User.findById(userId)
      .populate('projects')
      .select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      projects: user.projects,
      count: user.projects.length,
    });
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
};
