import os from 'os-utils';
import fs from 'fs-extra';
import path from 'path';
import { getProjectDirectory } from 'src/libs/naples/serverside';
import { checkSecret } from 'src/libs/naples/admin/serverside';

function myPromisify(func) {
  return function () {
    return new Promise(function (resolve) {
      func(resolve);
    });
  };
}

export default async function handler(req, res) {
  const { query, method } = req;
  const ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
  switch (method) {
    case 'GET':
      const hasSecret = await checkSecret(query.secret);
      if (!hasSecret) {
        return res.status(401).end('Unauthorized', ip);
      }
      const { type } = query;
      if (type === 'basic') {
        // numPages
        const countJsFiles = async dir => {
          let count = 0;
          const files = await fs.readdir(dir);
          for (const file of files) {
            const filePath = path.join(dir, file);
            const fileState = await fs.stat(filePath);
            if (fileState.isFile()) {
              if (file.match(/\.js$/)) {
                count++;
              }
            } else {
              count += await countJsFiles(filePath);
            }
          }
          return count;
        };
        const numPagesAll = await countJsFiles(
          path.join(getProjectDirectory(), 'src/pages')
        );
        const numPagesAPI = await countJsFiles(
          path.join(getProjectDirectory(), 'src/pages/api')
        );

        res.status(200).json({
          serverStartTime: new Date().getTime() - os.processUptime() * 1000,
          numPages: numPagesAll - numPagesAPI,
          numAPIs: numPagesAPI,
          cpuCores: os.cpuCount(),
          platform: os.platform(),
          totalMem: os.totalmem(),
          freeMem: os.freemem(),
        });
      } else if (type === 'performance') {
        // CPU Usage
        const cpuUsage = await myPromisify(os.cpuUsage)();

        res.status(200).json({
          cpuUsage,
          freememPercentage: os.freememPercentage(),
          loadAvg5: os.loadavg(5),
        });
      } else {
        res.status(200).json({});
      }
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
