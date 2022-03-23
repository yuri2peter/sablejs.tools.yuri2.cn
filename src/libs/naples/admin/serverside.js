import fs from 'fs-extra';
import path from 'path';
import { uuid, md5, opFrequencyTest, lock } from '@yuri2/utils-general';
import { getProjectDirectory } from 'src/libs/naples/serverside';

// 生成新秘钥
export async function initSecret() {
  const workingDirectory = getProjectDirectory();
  const filePath = path.join(workingDirectory, 'persists/naples/secret');
  const isExists = await fs.pathExists(filePath);
  if (!isExists) {
    await fs.ensureFile(filePath);
  }
  const newSecret = md5(uuid() + Math.random());
  await fs.writeFile(filePath, newSecret);
  return newSecret;
}

// 检测秘钥是否正确
const symbolCheckSecret = Symbol();
export async function checkSecret(str, ip = '') {
  const isNormal = opFrequencyTest(
    'naplesCheckSecretOpFrequencyTest' + ip,
    20,
    30
  );
  if (!isNormal) {
    console.warn(ip + ' tried to check naples admin secret too many times! ');
    return false;
  }
  return lock(async () => {
    const workingDirectory = getProjectDirectory();
    const filePath = path.join(workingDirectory, 'persists/naples/secret');
    const isExists = await fs.pathExists(filePath);
    if (!isExists) {
      await initSecret();
      return false;
    }
    const secret = await fs.readFile(filePath, 'utf8');
    return str === secret;
  }, [symbolCheckSecret]);
}
