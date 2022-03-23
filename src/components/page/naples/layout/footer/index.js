import Link from 'next/link';
import styles from './index.module.css';

export default function Index({ isHome = false }) {
  return (
    <footer className={styles.footer}>
      {isHome ? (
        <Link href="/">
          <a>Back to Home Page</a>
        </Link>
      ) : (
        <Link href="/naples">
          <a>Back to Admin Page</a>
        </Link>
      )}
    </footer>
  );
}
