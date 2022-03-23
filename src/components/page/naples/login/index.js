import styles from './index.module.css';
import cs from 'classnames';

export default function Index({
  secretText = '',
  onSecretTextChange = () => {},
  usernameText = '',
  onUsernameTextChange = () => {},
  onSubmit = () => {},
  error = false,
  submitting = false,
}) {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Naples Admin</h1>

        <p className={styles.description}>
          Development, monitoring, and management all in one place.
        </p>

        <div className={styles.form}>
          <form className="pure-form pure-form-stacked" onSubmit={onSubmit}>
            <fieldset>
              <label>Username(nickname)</label>
              <input
                className="pure-input-1"
                type="text"
                name="username"
                value={usernameText}
                onChange={onUsernameTextChange}
                required
              />

              <label>Secret Key</label>
              <input
                className="pure-input-1"
                type="password"
                value={secretText}
                onChange={onSecretTextChange}
                required
              />
              <span className={cs('pure-form-message')}>
                <span className={styles.hint}>
                  The <b>secret key</b> could be found at: {''}
                </span>
                <i className={styles.code}>
                  your_project/persists/naples/secret
                </i>
              </span>
              <button
                disabled={submitting}
                type="submit"
                className={cs(
                  'pure-button pure-button-primary pure-input-1',
                  styles.submit
                )}
              >
                Login
              </button>
            </fieldset>
          </form>
          <div className={cs(styles.error, { [styles.active]: error })}>
            Login Failed: Please enter the correct secret key. You can manually
            delete the secret file to reset the secret key.
          </div>
        </div>
      </main>
    </div>
  );
}
