import { Schema, model, connect } from 'mongoose';

const userSchema = new Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
});

export const User = model('User', userSchema);
