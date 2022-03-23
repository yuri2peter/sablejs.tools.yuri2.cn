import { Provider } from 'react-redux';
import Head from 'next/head';
import 'normalize.css';
import 'src/styles/globals.scss';
import 'src/styles/pure.css';
import store from 'src/store';

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
      </Head>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
