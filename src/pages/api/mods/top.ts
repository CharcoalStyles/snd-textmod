import { TextmodCardProps } from "@/components";
import { generateSupabaseClient } from "@/utils/supabase";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = Array<TextmodCardProps> | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const supabase = generateSupabaseClient();

  let { error, data } = await supabase
    .from("mods_rated_alltime")
    .select("*, mods(id, name, description, created_at, mod_votes(*), mod_comments(count), user_id(username))")
    .limit(10);

  if (error || !data) {
    console.error("Error fetching records:", error);
    return res.status(500).json({ message: "Error fetching records" });
  }

  return res.status(200).json(
    data.map(({mods}) => ({
      ...mods,
      commentCount: mods.mod_comments[0]?.count || 0,
      createdDate: new Date(mods.created_at),
      creator: {
        name: mods.user_id.username,
        slug: mods.user_id.username.toLowerCase().replace(" ", "-"),
      },
      downvotes: mods.mod_votes.filter(({ upvote }) => !upvote).length,
      upvotes: mods.mod_votes.filter(({ upvote }) => upvote).length,
      id: mods.id,
    })) as Array<TextmodCardProps>
  );
}
