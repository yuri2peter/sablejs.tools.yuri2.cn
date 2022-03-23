import fs from 'fs-extra';
import path from 'path';

const cache = { workingDirectory: '' };

/**
 *【缓存】 获取项目根目录的绝对路径（即.naples_filepath_mark所在目录）
 * @returns {string} 如 "/workspace/projects/personal/naples-next/"
 */
export function getProjectDirectory() {
  if (cache.workingDirectory) return cache.workingDirectory;

  let dir = path.join(__dirname);
  let found = false;
  let count = 0;
  while (!found && count < 50) {
    count++;
    dir = path.join(dir, '../');
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      if (file === '.naples_filepath_mark') {
        found = true;
      }
    });
  }
  cache.workingDirectory = dir;
  return dir;
}
