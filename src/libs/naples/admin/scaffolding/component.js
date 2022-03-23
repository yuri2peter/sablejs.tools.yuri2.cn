import fs from 'fs-extra';
import fsPath from 'path';
import { getProjectDirectory } from 'src/libs/naples/serverside';
import templateFileMessageText from './utils';

export default async function ({ path, withStyle, username }) {
  const result = [];
  if (withStyle) {
    await (async () => {
      const filePathRelative = fsPath.join(
        'src/components',
        path,
        'index.module.scss'
      );
      const filePath = fsPath.join(getProjectDirectory(), filePathRelative);
      const exists = await fs.pathExists(filePath);
      if (!exists) {
        await fs.ensureFile(filePath);
        await fs.writeFile(
          filePath,
          templateFileMessageText(username) + '.container {}',
          'utf8'
        );
        result.push(filePathRelative);
      }
    })();
  }
  await (async () => {
    const filePathRelative = fsPath.join('src/components', path, 'index.js');
    const filePath = fsPath.join(getProjectDirectory(), filePathRelative);
    const exists = await fs.pathExists(filePath);
    if (!exists) {
      await fs.ensureFile(filePath);
      await fs.writeFile(
        filePath,
        indexFileTemplate(withStyle, username),
        'utf8'
      );
      result.push(filePathRelative);
    }
  })();
  return result;
}

function indexFileTemplate(hasStyle = false, username) {
  const textA =
    templateFileMessageText(username) +
    `// import { useState, useEffect, useCallback, useRef } from 'react';

export default function Index({ }) {
  return <div></div>;
}`;
  const textB =
    templateFileMessageText(username) +
    `// import { useState, useEffect, useCallback, useRef } from 'react';
// import cs from 'classnames';
import styles from './index.module.scss';

export default function Index({ }) {
  return <div className={styles.container}></div>;
}`;
  return hasStyle ? textB : textA;
}
