import mongoose from 'mongoose';
import config from './config/config.js';

export async function connectMongoDB() {
  mongoose.connect(config.mongoDBURL);
}
