import { supabaseAtom } from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";

type UseTextmodSearchProps = {
  search: string;
  limit?: number;
};

export const useTextmodSearch = ({ search, limit }: UseTextmodSearchProps) => {
  const [supabase] = useAtom(supabaseAtom);

  const { data, error, isLoading } = useQuery({
    enabled: true,
    queryKey: ["mod-search", search, limit],
    queryFn: async () => {
      if (search.length < 3) return [];
      const { data, error } = await supabase.rpc("search_mods", {
        keyword: search,
      });

      if (error) {
        console.error("Error fetching records:", error);
        throw error;
      }

      return data;
    },
  });

  return { data, error, isLoading };
};
