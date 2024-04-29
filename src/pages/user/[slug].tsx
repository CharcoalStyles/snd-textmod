import { Header, Loader, TextmodList } from "@/components";
import { Text } from "@/components/ui";
import { useTextmodsQuery } from "@/hooks/useTextmodsQuery";
import { supabaseAtom } from "@/utils/supabase";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function UserSlugPage() {
  const router = useRouter();
  const slug = router.query.slug as string;
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
  }, [slug]);

  return (
    <main className="h-screen pb-14 bg-right bg-cover w-screen">
      <Header />

      <div className="mt-10 mx-4 flex flex-row gap-4 justify-center flex-wrap">
        <div className="basis-72 max-w-96  flex-grow">
          <div className="flex justify-center">
            {userName === "" && <Loader size="2xl" color="secondary" />}
            {userName !== "" && (
              <Text fontSize="3xl" fontType="heading">
                {userName.endsWith("s") ? userName + "'" : userName + "'s"} Mods
              </Text>
            )}
          </div>
          {userName && <UserModList userName={userName} />}
        </div>
      </div>
    </main>
  );
}
const UserModList = ({ userName }: { userName: string }) => {
  return (
    <TextmodList
      query={{
        orderBy: "newest",
        userName: userName,
      }}
    />
  );
};
