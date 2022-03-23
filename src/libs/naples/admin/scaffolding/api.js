import fs from 'fs-extra';
import fsPath from 'path';
import { getProjectDirectory } from 'src/libs/naples/serverside';
import templateFileMessageText from './utils';

export default async function ({ path, username, ...props }) {
  const result = [];
  await (async () => {
    const filePathRelative = fsPath.join('src/pages/api', path + '.js');
    const filePath = fsPath.join(getProjectDirectory(), filePathRelative);
    const exists = await fs.pathExists(filePath);
    if (!exists) {
      await fs.ensureFile(filePath);
      await fs.writeFile(filePath, indexFileTemplate(username, props), 'utf8');
      result.push(filePathRelative);
    }
  })();
  return result;
}

function indexFileTemplate(
  username,
  { useIP, useGet, usePost, usePut, useDelete, useDisableBodyParser }
) {
  let content = '';
  if (useIP) {
    content +=
      "  // const clientIP = req.headers['x-real-ip'] || req.connection.remoteAddress;\n";
  }
  content += `  // return res.status(200).json({ hello: 'world' });\n`;
  content += `  // return res.status(401).end('Unauthorized');\n\n`;
  if (!(useGet || usePost || usePut || useDelete)) {
    content += "  res.status(200).json({ hello: 'world' });\n";
  } else {
    content += '  switch (method.toUpperCase()) {\n';
    let allowMethods = [];
    const doMethod = method => {
      allowMethods.push(`'${method}'`);
      content += `   case '${method}':\n`;
      content += `     break;\n`;
    };
    if (useGet) doMethod('GET');
    if (usePost) doMethod('POST');
    if (usePut) doMethod('PUT');
    if (useDelete) doMethod('DELETE');
    content += '    default:\n';
    content += `      res.setHeader('Allow', [${allowMethods.join(', ')}]);\n`;
    content += '      res.status(405).end(`Method ${method} Not Allowed`);\n';
    content += '  }\n';
  }
  let text =
    templateFileMessageText(username) +
    'export default async function handler(req, res) {\n' +
    '  const { body, query, method } = req;\n' +
    '  const { } = body;\n' +
    '  const { } = query;\n' +
    content +
    '}';

  if (useDisableBodyParser) {
    text += `

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
      `;
  }

  return text;
}
