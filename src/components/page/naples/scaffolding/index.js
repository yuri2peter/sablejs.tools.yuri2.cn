// import cs from 'classnames';
import styles from './index.module.scss';

export default function Index({
  submitting,
  onForm1Submit,
  onForm2Submit,
  onForm3Submit,
}) {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Scaffolding</h1>
        <div className="pure-g">
          <div className="pure-u-1 pure-u-lg-1-2 pure-u-xl-1-3">
            <div className={styles.card}>
              <h2>Component</h2>
              <form
                className="pure-form pure-form-stacked"
                onSubmit={onForm1Submit}
              >
                <fieldset>
                  <div className="pure-control-group">
                    <label>Path</label>
                    <input
                      name="path"
                      type="text"
                      placeholder="e.g. form/label"
                      required
                    />
                  </div>
                  <div className="pure-controls">
                    <label htmlFor="cb1_1" className="pure-checkbox">
                      <input type="checkbox" id="cb1_1" name="cb1_1" /> With{' '}
                      <code className={styles.code}>index.module.scss</code>
                    </label>
                    <button
                      disabled={submitting}
                      type="submit"
                      className="pure-button pure-button-primary"
                    >
                      Generate Files
                    </button>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
          <div className="pure-u-1 pure-u-lg-1-2 pure-u-xl-1-3">
            <div className={styles.card}>
              <h2>Page</h2>
              <form
                className="pure-form pure-form-stacked"
                onSubmit={onForm2Submit}
              >
                <fieldset>
                  <div className="pure-control-group">
                    <label>Path</label>
                    <input
                      name="path"
                      type="text"
                      placeholder="e.g. shop/index"
                      required
                    />
                  </div>
                  <div className="pure-controls">
                    <button
                      disabled={submitting}
                      type="submit"
                      className="pure-button pure-button-primary"
                    >
                      Generate Files
                    </button>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
          <div className="pure-u-1 pure-u-lg-1-2 pure-u-xl-1-3">
            <div className={styles.card}>
              <h2>API</h2>
              <form
                className="pure-form pure-form-stacked"
                onSubmit={onForm3Submit}
              >
                <fieldset>
                  <div className="pure-control-group">
                    <label>Path</label>
                    <input
                      name="path"
                      type="text"
                      placeholder="e.g. data/user"
                      required
                    />
                  </div>
                  <div className="pure-controls">
                    <label htmlFor="cb3_1" className="pure-checkbox">
                      <input type="checkbox" id="cb3_1" /> GET
                    </label>
                    <label htmlFor="cb3_2" className="pure-checkbox">
                      <input type="checkbox" id="cb3_2" /> POST
                    </label>
                    <label htmlFor="cb3_3" className="pure-checkbox">
                      <input type="checkbox" id="cb3_3" /> PUT
                    </label>
                    <label htmlFor="cb3_4" className="pure-checkbox">
                      <input type="checkbox" id="cb3_4" /> DELETE
                    </label>
                    <label htmlFor="cb3_5" className="pure-checkbox">
                      <input type="checkbox" id="cb3_5" /> Get Client IP
                    </label>
                    <label htmlFor="cb3_6" className="pure-checkbox">
                      <input type="checkbox" id="cb3_6" /> Disable default body
                      parser
                    </label>
                    <button
                      disabled={submitting}
                      type="submit"
                      className="pure-button pure-button-primary"
                    >
                      Generate Files
                    </button>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
