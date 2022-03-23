import styles from './index.module.css';
import Link from 'next/link';

export default function Index({ localUsername = '' }) {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          {localUsername ? `Welcome, ${localUsername}!` : 'Naples Admin'}
        </h1>

        <p className={styles.description}>
          Development, monitoring, and management all in one place.
        </p>

        <div className={styles.grid}>
          <Link href="/naples/dashboard">
            <a className={styles.card}>
              <h2>Dashboard</h2>
              <p>Check the current situation of the server.</p>
            </a>
          </Link>
          <Link href="/naples/scaffolding">
            <a className={styles.card}>
              <h2>Scaffolding</h2>
              <p>Generate components and APIs.</p>
            </a>
          </Link>
          <Link href="/naples/examples">
            <a className={styles.card}>
              <h2>Examples</h2>
              <p>Awesome features all out of box.</p>
            </a>
          </Link>
          <Link href="/naples/logout">
            <a className={styles.card}>
              <h2>Logout</h2>
              <p>Useful for leaveing the computer for a long time.</p>
            </a>
          </Link>
        </div>
      </main>
    </div>
  );
}
