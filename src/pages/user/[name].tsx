import { Header, Loader, TextmodList } from "@/components";
import { Footer } from "@/components/Footer";
import { Text } from "@/components/ui";
import { useTextmodsQuery } from "@/hooks/useTextmodsQuery";
import { supabaseAtom } from "@/utils/supabase";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function UserSlugPage() {
  const router = useRouter();
  const slug = router.query.name as string;
  const [userName, setUserName] = useState<string>("");
  const [supabase] = useAtom(supabaseAtom);

  useEffect(() => {
    if (slug) {
      supabase
        .from("profiles")
        .select("username")
        .ilike("username", slug)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error("Error fetching records:", error);
            throw error;
          }
          setUserName(data.username);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return (
    <main className="h-screen min-h-screen w-screen contain-content">
      <Header />

      <div className="h-screen p-2 w-screen overflow-y-auto scrollbar scrollbar-thumb-primary">
        <div className="mt-10 mx-4 flex flex-row gap-4 justify-center flex-wrap">
          <div className="basis-72 max-w-96  flex-grow">
            <div className="flex justify-center">
              {userName === "" && <Loader size="2xl" color="secondary" />}
              {userName !== "" && (
                <Text fontSize="3xl" fontType="heading">
                  {userName.endsWith("s") ? userName + "'" : userName + "'s"}{" "}
                  Mods
                </Text>
              )}
            </div>
            {userName && <UserModList userName={userName} />}
          </div>
        </div>
        <div className="h-40"></div>
      </div>

      <Footer />
    </main>
  );
}
const UserModList = ({ userName }: { userName: string }) => {
  return (
    <TextmodList
      query={{
        orderBy: "newest",
        userName: userName,
        limit: 20
      }}
    />
  );
};
