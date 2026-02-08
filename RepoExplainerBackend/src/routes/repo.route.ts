import express from 'express';
import { analyzeRepo } from '../controllers/repo.controller.js';
import { authMiddleware } from '../middlewares/auth.js';
const repoRouter = express.Router();

repoRouter.post('/repo', authMiddleware, analyzeRepo);

export default repoRouter;
