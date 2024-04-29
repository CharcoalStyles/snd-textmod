import { TextmodCardProps } from "@/components/TextmodCard";
import { Database } from "@/utils/schema";
import { supabaseAtom } from "@/utils/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";

type UseTextmodsQueryProps = {
  userName?: string;
  orderBy?: "newest" | "oldest" | "top";
  limit?: number;
  lastDate?: Date;
};

export const useTextmodsQuery = ({
  limit = 10,
  orderBy = "newest",
  userName,
  lastDate,
}: UseTextmodsQueryProps) => {
  const [supabase] = useAtom(supabaseAtom);
  const queryClient = useQueryClient();

  const { data: userData, error: userError } = useQuery({
    enabled: true,
    queryKey: ["userData", "tms"],
    queryFn: async () => {
      if (!userName)
        return {
          id: "",
        };

      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .ilike("username", userName)
        .single();

      if (error) {
        console.error("Error fetching records:", error);
        throw error;
      }

      return data;
    },
  });

  const { data, error, isLoading, refetch } = useQuery({
    enabled: true,
    queryKey: ["mods"],
    queryFn: async () => {
      let query = supabase
        .from("mods")
        .select("*,mod_votes(*), mod_comments(count), user_id(username)");

      if (userData && userData?.id !== "") {
        query = query.eq("user_id", userData.id);
      }

      if (lastDate) {
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
        var creatorName: string = mod.user_id.username;
        //@ts-ignore
        var creatorSlug: string = mod.user_id.username
          .toLowerCase()
          .replace(" ", "-");

        return {
          id: mod.id,
          commentCount: mod.mod_comments[0].count,
          createdDate: new Date(mod.created_at),
          creator: {
            name: creatorName,
            slug: creatorSlug,
          },
          description: mod.description,
          downvotes: mod.mod_votes.filter(({ upvote }) => !upvote).length,
          name: mod.name,
          mod: mod.mod,
          upvotes: mod.mod_votes.filter(({ upvote }) => upvote).length,
        } as TextmodCardProps;
      });

      return fixedData;
    },
  });

  return { data, error, isLoading, refetch };
};
