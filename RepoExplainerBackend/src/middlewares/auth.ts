import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config/config.js';

const jwtKey = config.jwtkey;

declare global {
  namespace Express {
    interface Request {
      userID?: string;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!jwtKey) {
    throw new Error('JWT_KEY is missing in environment variables');
  }

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized access' });
  }
  try {
    if (token) {
      const decoded = jwt.verify(token, jwtKey) as JwtPayload;

      req.userID = decoded.id as string;
      next();
    } else {
      throw new Error('Token is Missing');
    }
  } catch (err) {
    return res.status(401).json({ message: 'Invalid/Expired token' });
  }
};
