import Head from "next/head";
import "react";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import Nav from "../components/Layout/Nav";
import { Subscriptions } from "../components/Query/Subscriptions";
import Store from "../components/Store/Store";
import { ONE_HOUR_MS, ONE_MINUTES_MS } from "../lib/constants";
import "../styles/globals.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: ONE_MINUTES_MS,
      cacheTime: ONE_HOUR_MS,
      retry: false,
    },
  },
});

export default function App({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Store>
        <Subscriptions />
        <Head>
          <title>Cubic</title>
        </Head>
        <div className="flex flex-col items-center bg-drip-purple text-white min-h-screen">
          <Nav />
          <main className="flex flex-col justify-start items-center w-full sm:max-w-screen-xl px-4">
            <Component {...pageProps} />
          </main>
        </div>
      </Store>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
