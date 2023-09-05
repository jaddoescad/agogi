import 'styles/main.css';
import 'styles/chrome-bug.css';
import 'styles/nprogress.css'; // Import the CSS

import { useEffect, useState } from 'react';
import React from 'react';

import Layout from 'components/Layout';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { AppProps } from 'next/app';
import { MyUserContextProvider } from 'utils/useUser';
import type { Database } from 'types/types_db';
import { ChakraProvider } from '@chakra-ui/react';
import { Analytics } from '@vercel/analytics/react';
import NextNProgress from 'nextjs-progressbar';
import Router from 'next/router';
import 'katex/dist/katex.min.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from 'utils/supabase-client';

// Hook up NProgress to page change start and stop events

export default function MyApp({ Component, pageProps }: AppProps) {


  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <div>
            <SessionContextProvider supabaseClient={supabase}>
              <MyUserContextProvider>
                <Layout>
                  <NextNProgress
                    color="#29D"
                    startPosition={0.3}
                    stopDelayMs={200}
                    height={3}
                    showOnShallow={true}
                  />

                  <Component {...pageProps} />
                </Layout>
              </MyUserContextProvider>
            </SessionContextProvider>
          </div>
        </ChakraProvider>
        <Analytics />
      </QueryClientProvider>
    </>
  );
}
