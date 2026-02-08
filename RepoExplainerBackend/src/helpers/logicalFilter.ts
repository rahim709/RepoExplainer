export const isLogicalFile = (path: string) => {
  const goodExts = ['.ts', '.js', '.py', '.rs', '.go', '.toml', '.json', '.md'];
  const badFolders = ['node_modules', 'target', 'dist', '.git', 'build'];

  const hasGoodExt = goodExts.some((ext) => path.endsWith(ext));
  const isInsideBadFolder = badFolders.some((folder) => path.includes(folder));

  return hasGoodExt && !isInsideBadFolder;
};
