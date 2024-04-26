import { supabaseAtom } from "@/utils/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";

type UseTextmodsProps = {
  userId?: string;
  orderBy?: "newest" | "oldest" | "top";
  limit?: number;
  lastDate?: Date;
};

export const useTextmods = ({
  limit = 10,
  orderBy = "newest",
  userId,
  lastDate
}: UseTextmodsProps) => {
  const [supabase] = useAtom(supabaseAtom);
  const queryClient = useQueryClient();

  const { data, error, isLoading, refetch } = useQuery({
    enabled: true,
    queryKey: ["userData", "tms"],
    queryFn: async () => {
      let query = supabase
        .from("mods")
        .select("*,mod_votes(*), mod_comments(count), user_id(username)");

      if (userId) {
        query = query.eq("user_id", userId);
      }

      if (lastDate){
        query = query.lt("created_at", lastDate);
      }

      if (orderBy === "newest") {
        query = query.order("created_at", { ascending: false });
      } else if (orderBy === "oldest") {
        query = query.order("created_at", { ascending: true });
      } else if (orderBy === "top") {
        query = query.order("mod_votes", { ascending: false });
      }

      const { data, error } = await query.limit(limit);

      if (error) {
        console.error("Error fetching records:", error);
        throw error;
      }

      const fixedData = data.map((mod) => {
        //@ts-ignore
        var creatorName:string = mod.user_id.username;
        return {
          ...mod,
          username: creatorName,
          createdDate: new Date(mod.created_at)
        };
      });

      return fixedData;
    },
  });

  return { data, error, isLoading, refetch };
};