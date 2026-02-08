// Server config!

import dotenv from 'dotenv';
dotenv.config();
interface Config {
  port: number;
  nodeEnv: string;
  mongoDBURL: string;
  jwtkey: string;
  githubPat: string;
  geminiAPI: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoDBURL: process.env.MONGODBURL || '',
  jwtkey: process.env.JWTKEY || '',
  githubPat: process.env.GITHUB_PAT || '',
  geminiAPI: process.env.GEMINI_API_KEY || ' ',
};

export default config;
