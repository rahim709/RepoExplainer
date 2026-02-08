// Fetches code from GitHub

import { response } from 'express';
import config from '../config/config.js';
import { Octokit, App } from 'octokit';

// Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
const octokit = new Octokit({ auth: config.githubPat });

// Compare: https://docs.github.com/en/rest/reference/users#get-the-authenticated-user
// export async function check() {
//   const {
//     data: { login },
//   } = await octokit.rest.users.getAuthenticated();
//   console.log('Hello, %s', login);
// }

export const getRepoTree = async (
  owner: string,
  repo: string,
  branch: string = 'main',
) => {
  try {
    const response = await octokit.request(
      'GET /repos/{owner}/{repo}/git/trees/{tree_sha}',
      {
        owner,
        repo,
        tree_sha: branch,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
        recursive: 'true',
      },
    );
    return response.data.tree;
  } catch {
    return null;
  }
};

export const getFileContent = async (
  owner: string,
  repo: string,
  path: string,
) => {
  try {
    const response = await octokit.request(
      'GET /repos/{owner}/{repo}/contents/{path}',
      {
        owner,
        repo,
        path,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );
    const data = response.data as any;
    if (data.content) {
      return Buffer.from(data.content, 'base64').toString('utf-8');
    }
    return '';
  } catch (error) {
    console.log(`Error Fetching file : ${path}`, error);
    return null;
  }
};
