import express from 'express';
import { errorHandler } from './middlewares/errorHandler.js';
import cors from 'cors';
import { Request, Response } from 'express';
import userRouter from './routes/users.route.js';
import { connectMongoDB } from './db.js';
import repoRouter from './routes/repo.route.js';
import cookieParse from 'cookie-parser';
import chatRouter from './routes/chat.route.js';
const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://10.227.87.58:3000',
        'http://localhost:3000', // Dev
        'https://tambo-ai-frontend.vercel.app', // Prod
        'https://repoexplainer-app.vercel.app',
        'http://10.227.87.113:3000',
      ];

      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Essential for Cookies
    // ... rest of config
  }),
);
app.use(cookieParse());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectMongoDB(); // MongoDB Connection!

// Routes!! Here!!

app.use('/api/user', userRouter);
app.use('/api', repoRouter);
app.use('/api/user', chatRouter);

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Backend API' });
});

// Error Handler At the last!!
app.use(errorHandler);

export default app;
