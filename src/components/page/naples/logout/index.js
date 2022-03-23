import cs from 'classnames';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import styles from './index.module.scss';

export default function Index({ onSubmit, localUsername }) {
  const [checkedRemember, setCheckedRemember] = useState(true);
  const [checkedReset, setCheckedRem] = useState(false);
  const onFormSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onSubmit({ checkedRemember, checkedReset });
    },
    [checkedRemember, checkedReset, onSubmit]
  );
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Naples Admin</h1>

        <p className={styles.description}>See you soon, {localUsername} :)</p>

        <div className={styles.form}>
          <form className="pure-form pure-form-stacked" onSubmit={onFormSubmit}>
            <fieldset>
              <label className="pure-checkbox">
                <input
                  type="checkbox"
                  checked={checkedRemember}
                  onChange={(e) => setCheckedRemember(e.target.checked)}
                />{' '}
                Remember me
              </label>
              <label className="pure-checkbox">
                <input
                  type="checkbox"
                  checked={checkedReset}
                  onChange={(e) => setCheckedRem(e.target.checked)}
                />{' '}
                Reset the secret
              </label>
              <button
                type="submit"
                className={cs(
                  'pure-button pure-button-primary pure-input-1',
                  styles.submit
                )}
              >
                Logout
              </button>
              <Link href="/naples" passHref>
                <button className={cs('pure-button pure-input-1')}>Back</button>
              </Link>
            </fieldset>
          </form>
        </div>
      </main>
    </div>
  );
}
