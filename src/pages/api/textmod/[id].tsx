
import { getCachedTextmod } from "@/utils/dynamo";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string | null>
) {

  const { id } = req.query;

  //convert id to number
  const idNum = parseInt(id as string);

  const modText = await getCachedTextmod(idNum);

  if (!modText) {
    return res.status(404).json(null);
  }

  return res.status(200).json(modText);
}