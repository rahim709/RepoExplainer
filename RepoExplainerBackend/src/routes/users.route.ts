import express from 'express';
import { validate } from '../middlewares/validation.js';
import { userValidationSchema } from '../models/userSignup.model.js';
import { authMiddleware } from '../middlewares/auth.js';
import {
  loginUser,
  registerUser,
  logoutUser,
  checkAuth,
  getAllProjects,
} from '../controllers/auth.controller.js';

const userRouter = express.Router();

userRouter.post('/register', validate(userValidationSchema), registerUser);
userRouter.post('/login', validate(userValidationSchema), loginUser);
userRouter.post('/logout', logoutUser);
userRouter.get('/check-auth', authMiddleware, checkAuth);
userRouter.get('/allprojects', authMiddleware, getAllProjects);

export default userRouter;
