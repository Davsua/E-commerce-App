import { SessionProvider } from 'next-auth/react';
import { AuthProvider, CartProvider, UiProvider } from '<@davsua>/context';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

import '<@davsua>/styles/globals.css';

import { lightTheme } from '<@davsua>/themes';
import { CssBaseline, ThemeProvider } from '@mui/material';
import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <PayPalScriptProvider options={{ 'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT || '' }}>
        <SWRConfig
          value={{
            fetcher: (resource, init) => fetch(resource, init).then((res) => res.json()),
          }}
        >
          <AuthProvider>
            <CartProvider>
              <UiProvider>
                <ThemeProvider theme={lightTheme}>
                  <CssBaseline />
                  <Component {...pageProps} />
                </ThemeProvider>
              </UiProvider>
            </CartProvider>
          </AuthProvider>
        </SWRConfig>
      </PayPalScriptProvider>
    </SessionProvider>
  );
}
