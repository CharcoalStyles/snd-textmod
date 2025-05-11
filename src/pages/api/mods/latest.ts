import { TextmodCardProps } from "@/components";
import { generateSupabaseClient, sbToTextmods } from "@/utils/supabase";
import type { NextApiRequest, NextApiResponse } from "next";
import { getCachedTextmod, setCachedTextmod } from "@/utils/dynamo";

type ResponseData = Array<TextmodCardProps> | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const table = "mods";
  const tableKey = `${table}-latest`;
  const items = await getCachedTextmod(tableKey);

  if (items && items.length > 0) {
    console.log("Sending data 1");
    // @ts-ignore
    return res.status(200).json(items);
  }

  console.log("Getting live data");
  const supabase = generateSupabaseClient();

  let { error, data } = await supabase
    .from(table)
    .select("*,mod_votes(*), mod_comments(count), user_id(username)")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error || !data) {
    console.error("Error fetching records:", error);
    return res.status(500).json({ message: "Error fetching records" });
  }

  const textmods = sbToTextmods(data);

  await Promise.all(textmods.map((d, i) => setCachedTextmod(tableKey, d, i)));

  return res.status(200).json(textmods);
}
