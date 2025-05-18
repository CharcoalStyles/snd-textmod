import { TextmodCardProps } from "@/components";
import { getMods } from "@/utils/dynamo";
import { generateSupabaseClient, sbToTextmods } from "@/utils/supabase";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = Array<TextmodCardProps> | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const supabase = generateSupabaseClient();

  let { error, data } = await supabase
    .from("mods")
    .select("id, mod_votes(*), mod_comments(count), user_id(username)")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error || !data) {
    console.error("Error fetching records:", error);
    return res.status(500).json({ message: "Error fetching records" });
  }

  const x = await getMods(data.map((d) => d.id.toString()));

  const textmods = sbToTextmods(
    x.map((mod) => {
      const otherData = data.find((d) => d.id === mod!.id);
      if (otherData) {
        return {
          ...mod,
          mod_comments: otherData.mod_comments,
          mod_votes: otherData.mod_votes,
          user_id: otherData.user_id,
        };
      }
    })
  );

  return res.status(200).json(textmods);
}
