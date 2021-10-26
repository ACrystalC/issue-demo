import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';

import { Provider as AuthProvider } from 'next-auth/client';

import { shouldPolyfill as shouldPolyfillIntlRelativeTimeFormat } from '@formatjs/intl-relativetimeformat/should-polyfill';
import { shouldPolyfill as shouldPolyfillIntlDateTimeFormat } from '@formatjs/intl-datetimeformat/should-polyfill';

/* --------------------------------------------------------
 * Polyfills for Intl API
 * ------------------------------------------------------*/

(async () => {
  const polyfills = [];
  const data = [];

  if (!shouldPolyfillIntlRelativeTimeFormat()) {
    polyfills.push(import('@formatjs/intl-relativetimeformat/polyfill'));

    data.push(import('@formatjs/intl-relativetimeformat/locale-data/en'));
  }

  if (!shouldPolyfillIntlDateTimeFormat()) {
    polyfills.push(import('@formatjs/intl-datetimeformat/polyfill'));

    data.push(import('@formatjs/intl-datetimeformat/add-golden-tz'));
    data.push(import('@formatjs/intl-datetimeformat/locale-data/en'));
  }

  if (polyfills.length !== 0) {
    await Promise.all(polyfills);
    await Promise.all(data);
  }
})();

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to guide!</title>
      </Head>
      <div className="app">
        <header className="flex">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/nx-logo-white.svg" alt="Nx logo" width="75" height="50" />
          <h1>Welcome to guide!</h1>
        </header>
        <main>
        <AuthProvider
          session={{}}
          options={{}}
        >
          <Component {...pageProps} />
        </AuthProvider>
        </main>
      </div>
    </>
  );
}

export default CustomApp;
