import 'styles/main.css';
import 'styles/chrome-bug.css';
import 'styles/nprogress.css'; // Import the CSS

import { useEffect, useState } from 'react';
import React from 'react';

import Layout from 'components/Layout';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { AppProps } from 'next/app';
import { MyUserContextProvider } from 'utils/useUser';
import type { Database } from 'types_db';
import { ChakraProvider } from '@chakra-ui/react';
import { Analytics } from '@vercel/analytics/react';
import NextNProgress from 'nextjs-progressbar';
import Router from 'next/router';

// Hook up NProgress to page change start and stop events


export default function MyApp({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() =>
    createBrowserSupabaseClient<Database>()
  );
  // useEffect(() => {
  //   document.body.classList?.remove('loading');
  // }, []);

  return (
    <>
      <ChakraProvider>
        <div className="bg-black">
          <SessionContextProvider supabaseClient={supabaseClient}>
            <MyUserContextProvider>
              <Layout>
              <NextNProgress color="#29D" startPosition={0.3} stopDelayMs={200} height={3} showOnShallow={true} />

                <Component {...pageProps} />
              </Layout>
            </MyUserContextProvider>
          </SessionContextProvider>
        </div>
      </ChakraProvider>
      <Analytics />
    </>
  );
}
