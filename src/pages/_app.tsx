import { AppProps } from "next/app";
import "./globals.css";
import { Cuprum, Jersey_25 } from "next/font/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { supabaseAtom } from "@/utils/supabase";
import { createContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

const AuthContext = createContext<{ user: User | undefined, loading: boolean }>({ user: undefined, loading: true });
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
  const [supabase] = useAtom(supabaseAtom);
  const [user, setUser] = useState<User | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user ? user : undefined);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(user ? session?.user ?? undefined : undefined);
        setLoading(false);
      },
    );

    return () => listener?.subscription.unsubscribe();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className={`${jersey.variable} ${cuprum.variable}`}>
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={{ user, loading }}>
          <Component {...pageProps} />
        </AuthContext.Provider>
      </QueryClientProvider>
    </main>
  );
}

export default MyApp;
