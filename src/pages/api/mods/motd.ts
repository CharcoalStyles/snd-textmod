import { TextmodCardProps } from "@/components";
import { generateSupabaseClient, sbToTextmods } from "@/utils/supabase";
import type { NextApiRequest, NextApiResponse } from "next";
import { getCachedTextmod, setCachedTextmod } from "@/utils/dynamo";

type ResponseData = TextmodCardProps | { message: string } | null;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const today = new Date().toISOString().slice(0, 10);
  const tableKey = `mods-motd-${today}`;

  const cached = await getCachedTextmod(tableKey);
  if (cached && cached.length > 0) {
    return res.status(200).json(cached[0] as unknown as TextmodCardProps);
  }

  const supabase = generateSupabaseClient();
  const { data: ids, error: idError } = await supabase.from("mods").select("id");

  if (idError || !ids || ids.length === 0) {
    console.error("Error fetching mod ids:", idError);
    return res.status(200).json(null);
  }

  // Deterministic per-day pick, so the "mod of the day" is stable across
  // requests/cache regeneration without needing a persisted schedule.
  let hash = 0;
  for (const char of today) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  const pickedId = ids[Math.abs(hash) % ids.length].id;

  const { data, error } = await supabase
    .from("mods")
    .select("*,mod_votes(*), mod_comments(count), user_id(username), mod_tags(tag)")
    .eq("id", pickedId)
    .single();

  if (error || !data) {
    console.error("Error fetching mod of the day:", error);
    return res.status(200).json(null);
  }

  const [textmod] = sbToTextmods([data]);
  await setCachedTextmod(tableKey, textmod, 0);

  return res.status(200).json(textmod);
}
