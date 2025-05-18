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
    .from("mods")
    .select(
      "id, name, description, created_at, mod_votes(*), mod_comments(count), user_id(username)"
    )
    .order("created_at", { ascending: false })
    .limit(10);

  if (error || !data) {
    console.error("Error fetching records:", error);
    return res.status(500).json({ message: "Error fetching records" });
  }

  return res.status(200).json(
    data.map((d) => ({
      ...d,
      commentCount: d.mod_comments[0]?.count || 0,
      createdDate: new Date(d.created_at),
      creator: {
        name: d.user_id.username,
        slug: d.user_id.username.toLowerCase().replace(" ", "-"),
      },
      downvotes: d.mod_votes.filter(({ upvote }) => !upvote).length,
      upvotes: d.mod_votes.filter(({ upvote }) => upvote).length,
      id: d.id,
    })) as Array<TextmodCardProps>
  );
}
