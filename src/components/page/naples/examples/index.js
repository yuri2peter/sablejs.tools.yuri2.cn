/**
 * This file is generated automatically by naples scaffolding.
 * 展示一些开箱即用的功能和组件
 * @create February 26o 2022, 5:02:49 pm
 * @author Yuri2
 */

// import { useState, useEffect, useCallback, useRef } from 'react';
import cs from 'classnames';
import styles from './index.module.scss';
import Upload from './upload';
import Redux from './redux';

export default function Index({}) {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Examples</h1>
        <div className="pure-g" style={{ width: '100%' }}>
          <Card
            title="Ajax Uploading"
            description="Naples-next allow you to upload and manage your file so easliy."
          >
            <Upload />
          </Card>
          <Card
            title="Use Redux"
            description="This is a example of a redux application."
          >
            <Redux />
          </Card>
        </div>
      </main>
    </div>
  );
}

const Card = ({ children = null, title = 'title', description = '' }) => (
  <div className={cs(styles.card, 'pure-u-1 pure-u-lg-1-2 pure-u-xl-1-3')}>
    <h2>{title}</h2>
    {description && <p>{description}</p>}
    <div className={styles.hr} />
    {children}
  </div>
);
