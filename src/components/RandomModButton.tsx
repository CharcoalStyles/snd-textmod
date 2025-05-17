import { supabase } from "@/utils/supabase";
import { useRouter } from "next/router";
import { useState } from "react";

const getMod = async () => {
  // get supabase client
  return supabase
    .from("mods")
    .select("id")
    .then(({ data, error }) => {
      if (error) {
        console.error("Error fetching random mod:", error);
        return -1;
      }

      const randomIndex = Math.floor(Math.random() * data.length);
      const randomMod = data[randomIndex];
      if (!randomMod) {
        console.error("No mods found");
        return -1;
      }

      return randomMod.id;
    });
};

export const RandomModButton = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <div>
      <button
        className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        type="button"
        onClick={() => {
          setLoading(true);
          getMod()
            .then((modId) => {
              if (modId !== -1) {
                router.push(`/textmod/${modId}`);
              }
            })
            .finally(() => setLoading(false));
        }}
        disabled={loading}>
        {loading ? "Loading..." : "Get Random Mod"}
      </button>
    </div>
  );
};
