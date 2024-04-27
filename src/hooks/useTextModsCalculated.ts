import { TextmodCardProps } from "@/components/TextmodCard";
import { Database } from "@/utils/schema";
import { supabaseAtom } from "@/utils/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";

type UseTextModsCalculatedProps = keyof Database["public"]["Tables"];

export const useTextModsCalculated = (table: UseTextModsCalculatedProps) => {
  const [supabase] = useAtom(supabaseAtom);
  const queryClient = useQueryClient();

  const { data, error, isLoading, refetch } = useQuery({
    enabled: true,
    queryKey: ["calcMods", table, ],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(table)
        .select(
          "*, mods(*, mod_votes(*), mod_comments(count), user_id(username))"
        );

      if (error) {
        console.error("Error fetching records:", error);
        throw error;
      }

      const fixedData = data.map((row) => {

        // Forgive me, for this is the only way to make this work
        // The data returned from Supabase is correct, but the logic they have for types is broken
        //@ts-ignore
        const realMod = row.mods;
        return {
          //@ts-ignore
          commentCount: realMod.mod_comments[0].count,
          //@ts-ignore
          createdDate: new Date(realMod.created_at),
          //@ts-ignore
          creatorName: realMod.user_id.username,
          //@ts-ignore
          description: realMod.description,
          //@ts-ignore
          downvotes: realMod.mod_votes.filter(
            ({ upvote }: { upvote: boolean }) => !upvote
          ).length,
          //@ts-ignore
          name: realMod.name,
          //@ts-ignore
          upvotes: realMod.mod_votes.filter(
            ({ upvote }: { upvote: boolean }) => upvote
          ).length,
          //@ts-ignore
          id: realMod.id,
        } as TextmodCardProps;
      });

      return fixedData;
    },
  });

  return { data, error, isLoading, refetch };
};
