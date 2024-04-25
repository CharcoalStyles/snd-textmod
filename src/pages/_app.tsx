import { AppProps } from "next/app";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import "./globals.css";
import { Handjet } from "next/font/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { supabaseAtom } from "@/utils/supabase";

const queryClient = new QueryClient();

const handjet = Handjet({
  adjustFontFallback: false,
  weight: "400",
  display: "swap",
  variable: "--font-handjet",
  subsets: ["latin"],
});

// const jost = Jost({
//   weight: "600",
//   display: "swap",
//   variable: "--font-jost",
//   subsets: ["latin-ext", "latin"],
// });

function MyApp({ Component, pageProps }: AppProps) {
  const [supabase] = useAtom(supabaseAtom);
  return (
    <main className={`${handjet.variable}`}>
      <QueryClientProvider client={queryClient}>
        <SessionContextProvider supabaseClient={supabase}>
          <Component {...pageProps} />
        </SessionContextProvider>
      </QueryClientProvider>
    </main>
  );
}

export default MyApp;
