import express, { Router } from 'express';
import { chatWithRepo, deleteRepo } from '../controllers/chat.controller.js';
import { authMiddleware } from '../middlewares/auth.js';

const chatRouter = express.Router();

chatRouter.post('/chat', authMiddleware, chatWithRepo);
chatRouter.delete('/chat', authMiddleware, deleteRepo);

export default chatRouter;
