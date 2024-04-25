import { supabaseAtom } from "@/utils/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";

type UseTextmodsProps = {
  userId?: string;
  orderBy?: "newest" | "oldest" | "top";
  limit?: number;
};

export const useTextmods = ({
  limit = 10,
  orderBy = "newest",
  userId,
}: UseTextmodsProps) => {
  const [supabase] = useAtom(supabaseAtom);
  const queryClient = useQueryClient();
  console.log("useTextMods");

  const { data, error, isLoading, refetch } = useQuery({
    enabled: true,
    queryKey: ["userData", "tms"],
    queryFn: async () => {
      console.log("fetching data");
      let query = supabase
        .from("mods")
        .select("*,mod_votes(*),mod_comments(*)");

      if (userId) {
        query = query.eq("user_id", userId);
      }

      if (orderBy === "newest") {
        query = query.order("created_at", { ascending: false });
      } else if (orderBy === "oldest") {
        query = query.order("created_at", { ascending: true });
      } else if (orderBy === "top") {
        query = query.order("mod_votes", { ascending: false });
      }

      const { data, error } = await query.limit(limit);
      console.log("data", data);

      if (error) {
        console.error("Error fetching records:", error);
        throw error;
      }

      return data;
    },
  });

  console.log("data", data, "error", error, "isLoading", isLoading);
  return { data, error, isLoading, refetch };
};
