import { setCachedTextmod } from "@/utils/dynamo";
import { generateSupabaseClient, sbToTextmods } from "@/utils/supabase";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData =
  | {
      message: string;
    }
  | Array<any>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  console.log("Getting live data");
  const supabase = generateSupabaseClient();

  const { data, error } = await supabase
    .from("mods")
    .select("id, mod")
    .limit(1);

  if (error) {
    console.error("Error fetching records:", error);
    return res.status(500).json({ message: "Error fetching records" });
  }

  await Promise.all(
    data.map(async (d) => {
      const { id, mod } = d;
      return setCachedTextmod(id, mod);
    })
  );

  return res.status(200).json(data);
}
