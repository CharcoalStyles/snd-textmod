import { AppProps } from "next/app";
import "./globals.css";
import { Cuprum, Jersey_25 } from "next/font/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const jersey = Jersey_25({
  weight: "400",
  display: "swap",
  variable: "--font-jersey",
  subsets: ["latin"],
});

const cuprum = Cuprum({
  display: "swap",
  variable: "--font-cuprum",
  subsets: ["latin-ext", "latin"],
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main className={`${jersey.variable} ${cuprum.variable}`}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </main>
  );
}

export default MyApp;
