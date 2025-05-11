import { supabaseAtom } from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";

export const useTextMod = (id?: number) => {
  const [supabase] = useAtom(supabaseAtom);

  const { data, error, isLoading, refetch } = useQuery({
    enabled: true,
    queryKey: ["singleMod", id],
    queryFn: async () => {
      if (!id) return;

      let query = supabase
        .from("mods")
        .select(
          "id, name, description, created_at, main_image, mod_votes(*), mod_comments(*, user_id(id, username)), user_id(*)"
        )
        .eq("id", id);

      const { data, error } = await query.single();

      if (error) {
        console.error("Error fetching records:", error);
        throw error;
      }

      const fixedData = {
        id: data.id,
        mainImage: data.main_image,
        comments: data.mod_comments.map((c) => {
          return {
            creator: c.user_id as { id: string; username: string },
            createdDate: new Date(c.created_at),
            id: c.id,
            comment: c.comment ? c.comment : "",
          };
        }),
        createdDate: new Date(data.created_at),
        creator: {
          name: data.user_id.username,
          id: data.user_id.id,
          slug: data.user_id.username.toLowerCase().replace(" ", "-"),
        },
        description: data.description,
        name: data.name,
        votes: data.mod_votes,
      };

      return fixedData;
    },
  });

  return { data, error, isLoading, refetch };
};
