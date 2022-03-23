import styles from './index.module.css';
import Header from './header';
import Footer from './footer';

export default function Index({
  header = {},
  children = null,
  isHome = false,
}) {
  return (
    <div className={styles.container}>
      <Header {...header} />
      {children}
      <Footer isHome={isHome} />
    </div>
  );
}
