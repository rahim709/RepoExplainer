import { Request, Response } from 'express';
import Project from '../models/project.model.js';
import {
  identifyRelevantFiles,
  generateChatResponse,
} from '../services/ai.service.js';
import { getFileContent } from '../services/github.service.js';
import { User } from '../models/user.model.js';

export const chatWithRepo = async (req: Request, res: Response) => {
  const projectId = req.query.projectId as string;
  const message = req.body.message;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const filePaths = project.treeStructure.map((f: any) => f.path);

    console.log('AI is deciding which files to read...');
    const relevantFiles = await identifyRelevantFiles(message, filePaths);

    console.log(`AI selected: ${relevantFiles.join(', ')}`);

    if (relevantFiles.length === 0) {
      console.log('No specific files needed for this query.');
    }

    const fileContents = await Promise.all(
      relevantFiles.map(async (path: string) => {
        try {
          const content = await getFileContent(
            project.owner,
            project.repoName,
            path,
          );
          return `--- FILE: ${path} ---\n${content}\n`;
        } catch (err) {
          return `--- FILE: ${path} (Error fetching content) ---\n`;
        }
      }),
    );

    const combinedContext = fileContents.join('\n');
    const answer = await generateChatResponse(
      combinedContext,
      message,
      project.chatHistory,
    );

    const newMessages = [
      {
        role: 'user',
        content: message,
        timestamp: new Date(),
      },
      {
        role: 'model',
        content: answer || '',
        timestamp: new Date(),
      },
    ];

    await Project.findByIdAndUpdate(
      projectId,
      {
        $push: {
          chatHistory: {
            $each: newMessages,
          },
        },
      },
      { new: true, runValidators: true },
    );

    res.json({
      response: answer,
      filesUsed: relevantFiles,
    });
  } catch (error) {
    console.error('Chat Error:', error);
    return res.status(500).json({ error: 'Chat failed' });
  }
};

export const deleteRepo = async (req: Request, res: Response) => {
  try {
    const userId = req.userID;
    const projectId = req.query.projectId as string;

    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required' });
    }

    // 1. Delete the actual Project document
    await Project.findByIdAndDelete(projectId);

    // 2. Remove the Project ID from the User's 'projects' array
    await User.findByIdAndUpdate(userId, {
      $pull: { projects: projectId },
    });

    return res.status(200).json({ message: 'Repository deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to delete repository' });
  }
};
