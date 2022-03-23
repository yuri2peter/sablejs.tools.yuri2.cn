import fs from 'fs-extra';
import fsPath from 'path';
import { getProjectDirectory } from 'src/libs/naples/serverside';
import templateFileMessageText from './utils';

export default async function ({ path, username }) {
  const result = [];
  if (!path.match(/^\/?api\//)) {
    await (async () => {
      const filePathRelative = fsPath.join('src/pages', path + '.js');
      const filePath = fsPath.join(getProjectDirectory(), filePathRelative);
      const exists = await fs.pathExists(filePath);
      if (!exists) {
        await fs.ensureFile(filePath);
        await fs.writeFile(filePath, indexFileTemplate(username, path), 'utf8');
        result.push(filePathRelative);
      }
    })();
  }
  return result;
}

function indexFileTemplate(username, path) {
  const arrPath = path.split('/').filter(t => !!t);
  const importPath = ['src/components/page', ...arrPath].join('/');
  const componentName = getComponentName(arrPath.pop());
  const text =
    templateFileMessageText(username) +
    `// import { useState, useEffect, useCallback, useRef } from 'react';
// import { useRouter } from 'next/router';
// import ${componentName} from '${importPath}';

export default function Index({ }) {
  // const router = useRouter();
  // useEffect(() => {}, []);
  // return <${componentName} />;
}`;
  return text;
}

function getComponentName(str) {
  if (str.match(/^[a-zA-Z]+$/))
    return str.replace(str[0], str[0].toUpperCase());
  else return 'Component';
}
