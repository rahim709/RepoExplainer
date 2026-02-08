import mongoose, { Schema, Document, Model } from 'mongoose';

// The shape of the "Wizardry" analysis from Gemini
export interface IAiAnalysis {
  projectName: string;
  summary: string; // Matched with Schema
  techStack: string[];
  keyFeatures: string[];
  architecture: {
    style: string;
    explanation: string;
  };
  complexity: string;
}

// The shape of a Chat Message in history
export interface IChatMessage {
  role: 'user' | 'model';
  content: string;
  uiComponent?: string; // e.g., "TreeVisualizer", "CodeCard"
  uiData?: any; // JSON data for the UI component
  timestamp: Date;
}

// The Main Project Document
export interface IProject extends Document {
  owner: string;
  repoName: string;
  githubUrl: string;
  userId: mongoose.Types.ObjectId;

  // Structured AI Data
  aiAnalysis: IAiAnalysis;

  // File System
  treeStructure: any[];

  // Chat & Memory
  chatHistory: IChatMessage[];

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    owner: { type: String, required: true },
    repoName: { type: String, required: true },
    githubUrl: { type: String, required: true },

    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    aiAnalysis: {
      projectName: { type: String, required: true },
      summary: { type: String, required: true },
      techStack: [{ type: String }],
      keyFeatures: [{ type: String }],
      architecture: {
        style: { type: String },
        explanation: { type: String },
      },
      complexity: { type: String },
    },

    treeStructure: { type: Schema.Types.Mixed },

    chatHistory: [
      {
        role: {
          type: String,
          enum: ['user', 'model'],
          required: true,
        },
        content: { type: String, required: true },
        uiComponent: { type: String },
        uiData: { type: Schema.Types.Mixed },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

const Project = mongoose.model<IProject>('Project', projectSchema);

export default Project;
