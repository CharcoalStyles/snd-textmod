import { getCachedModText, setCachedModText } from "@/utils/dynamo";
import { generateSupabaseClient } from "@/utils/supabase";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = string | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const id = Number.parseInt(req.query.id as string);

  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "Invalid mod id" });
  }

  if (req.method === "GET") {
    const cached = await getCachedModText(id);
    if (cached !== null) {
      return res.status(200).json(cached);
    }

    // Cache miss: fall back to Postgres and backfill Dynamo for next time.
    const supabase = generateSupabaseClient();
    const { data, error } = await supabase
      .from("mods")
      .select("mod")
      .eq("id", id)
      .single();

    if (error || !data?.mod) {
      return res.status(404).json({ message: "No mod text found" });
    }

    await setCachedModText(id, data.mod);
    return res.status(200).json(data.mod);
  }

  if (req.method === "POST") {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length)
      : undefined;

    if (!token) {
      return res.status(401).json({ message: "Missing Authorization header" });
    }

    const { modText } = req.body as { modText?: string };
    if (typeof modText !== "string") {
      return res.status(400).json({ message: "Missing modText" });
    }

    const supabase = generateSupabaseClient(token);
    const { data: isOwner, error } = await supabase.rpc(
      "check_mod_ownership",
      { mod_id_param: id }
    );

    if (error || !isOwner) {
      return res.status(403).json({ message: "Not authorised to edit this mod" });
    }

    await setCachedModText(id, modText);
    return res.status(200).json(modText);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ message: "Method not allowed" });
}
