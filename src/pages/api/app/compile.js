/**
 * This file is generated automatically by naples scaffolding.
 * @create March 24o 2022, 4:13:40 pm
 * @author Yuri2
 */
import fs from 'fs-extra';
const { spawn } = require('child_process');
import path from 'path';
import { lock } from '@yuri2/utils-general';
import { getProjectDirectory } from 'src/libs/naples/serverside';
const babel = require('@babel/core');

export default async function handler(req, res) {
  const { body, query, method } = req;
  const { text } = body;
  const {} = query;
  // return res.status(200).json({ hello: 'world' });
  // return res.status(401).end('Unauthorized');

  switch (method.toUpperCase()) {
    case 'POST':
      try {
        const results = await compile(text);
        res.status(200).json(results);
      } catch {
        res.status(200).json({ error: true });
      }
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function compile(text) {
  return await lock(async () => {
    const prefix = 'temp_compile';
    const dirPath = path.join(getProjectDirectory(), 'persists/app', prefix);
    const filePathOriginal = path.join(dirPath, 'original.js');
    const filePathScript = path.join(dirPath, 'script.sh');
    const filePathCompiled = path.join(dirPath, 'compiled.txt');
    const transformed = babel.transformSync(text, {
      presets: [require('@babel/preset-env')],
    }).code;

    await prepareSablejs();
    await fs.ensureFile(filePathOriginal);
    await fs.ensureFile(filePathScript);
    await fs.writeFile(filePathOriginal, transformed);
    await fs.writeFile(
      filePathScript,
      `
    sablejs -i ${filePathOriginal} -o ${filePathCompiled}`
    );
    await runSh(filePathScript).catch(console.warn);
    const compiled = fs.readFileSync(filePathCompiled, 'utf-8');
    await fs.remove(dirPath);
    return { transformed, compiled };
  }, ['compiling']);
}

async function prepareSablejs() {
  const dirModule = path.join(getProjectDirectory(), 'node_modules/sablejs');
  const dirCopy = path.join(getProjectDirectory(), 'copyFiles');
  const filePathBin = path.join(dirModule, '.pkg/sablejs-linux-x64');
  const filePathAggrement = path.join(dirModule, 'bin/.aggrement');
  if (!fs.existsSync(filePathAggrement)) {
    await fs.copyFile(path.join(dirCopy, '.aggrement'), filePathAggrement);
  }
  if (!fs.existsSync(filePathBin)) {
    await fs.ensureDir(path.join(dirModule, '.pkg'));
    await fs.copyFile(path.join(dirCopy, 'sablejs-linux-x64'), filePathBin);
    await fs.chmod(filePathBin, 0o777);
  }
}

function runSh(filePath) {
  const handle = spawn('sh', [filePath]);
  // handle.stdout.on('data', data => {
  //   console.log(data.toString());
  // });
  // handle.stderr.on('data', data => {
  //   console.log(data.toString());
  // });
  return new Promise(resolve => {
    handle.on('close', () => {
      resolve();
    });
    // handle.on('exit', () => {
    //   console.log('exited');
    // });
  });
}
