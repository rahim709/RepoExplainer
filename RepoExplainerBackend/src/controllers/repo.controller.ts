// GitHub URL submission & status
import { Response, Request } from 'express';
import { getRepoTree, getFileContent } from '../services/github.service.js';
import { isLogicalFile } from '../helpers/logicalFilter.js';
import { getSummary } from '../services/ai.service.js';
import Project from '../models/project.model.js';
import { User } from '../models/user.model.js';

const extractGithubInfo = (url: string) => {
  const match = url.match(
    /github\.com\/([^\/]+)\/([^\/?#]+)(?:\.git)?(?:\/|$)/,
  );

  if (match) {
    return {
      owner: match[1],
      repo: match[2].replace(/\.git$/, ''),
    };
  }
  return null;
};

export const analyzeRepo = async (req: Request, res: Response) => {
  try {
    const repoUrl = req.body.url;
    if (typeof repoUrl != 'string')
      return res.status(403).json({ message: 'URL is not string' });

    const info = extractGithubInfo(repoUrl);
    if (!info) return res.status(400).json({ error: 'Invalid GitHub URL' });

    const { owner, repo } = info;
    console.log(`Targeting Owner: ${owner}, Repo: ${repo}`);

    const existingProject = await Project.findOne({
      owner: owner,
      repoName: repo,
      userId: req.userID,
    });

    if (existingProject) {
      console.log(`Returning existing project for ${owner}/${repo}`);
      return res.status(200).json(existingProject);
    }

    const repoTree = await getRepoTree(owner, repo);
    if (!repoTree)
      return res.status(402).json({ error: 'Failed getting repoTree' });

    const filteredRepoTree = repoTree.filter(
      (file: any) => file.type === 'blob' && isLogicalFile(file.path),
    );

    const heroFiles = filteredRepoTree.filter((f: any) => {
      const p = f.path.toLowerCase();
      return p === 'readme.md' || p === 'package.json' || p === 'cargo.toml';
    });

    const fileContents = await Promise.all(
      heroFiles.map(async (file: any) => {
        const content = await getFileContent(owner, repo, file.path);
        return `--- File: ${file.path} ---\n${content}`;
      }),
    );

    const fullFileContext = fileContents.join('\n\n');
    const treeContext = filteredRepoTree.map((f: any) => f.path).join('\n');

    const combinedContext = `
    Project File Structure:
    ${treeContext}

    Key File Contents:
    ${fullFileContext}
    `;

    const summary = await getSummary(combinedContext);
    if (!summary)
      return res.status(500).json({ error: 'AI Summary generation failed' });

    const initialChatMessage = {
      role: 'model',
      content: `I've analyzed your repository! Here's a quick summary:\n\n${summary.summary}\n\n**Tech Stack:** ${summary.techStack.join(', ')}`,
      uiComponent: 'ProjectSummaryCard',
      uiData: summary,
      timestamp: new Date(),
    };

    const project = await Project.create({
      owner: owner,
      repoName: repo,
      githubUrl: repoUrl,
      userId: req.userID,
      aiAnalysis: {
        projectName: summary.projectName,
        summary: summary.summary,
        techStack: summary.techStack,
        keyFeatures: summary.keyFeatures,
        architecture: summary.architecture,
        complexity: summary.complexity,
      },
      treeStructure: repoTree,
      chatHistory: [initialChatMessage],
    });

    await User.findByIdAndUpdate(
      req.userID,
      { $push: { projects: project._id } },
      { new: true },
    );

    console.log(`Project ${project._id} linked to User ${req.userID}`);

    res.status(201).json(project);
  } catch (err) {
    return res.status(402).json(err);
  }
};
