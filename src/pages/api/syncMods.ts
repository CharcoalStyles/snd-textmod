import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from "@/utils/supabase";
import { saveModText } from '@/utils/dynamo';
 
type ResponseData = {
  message: string
}
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {

  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }
  // get the request headers
  const headers = req.headers;
  const { "sync-key": syncKey } = headers;

  // check if the sync key is set
  if (!syncKey) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  // check if the sync key is correct
  if (syncKey !== process.env.SYNC_KEY) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  
  let offset = 0;
  const limit = 20;
  while (true) {
    const { data, error} = await supabase
      .from("mods")
      .select("*")
      .limit(limit)
      .range(offset, offset + limit - 1)
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching mods:", error);
      break;
    }
    console.log("Fetched mods:", data.length);

    if (!data || data.length === 0) {
      console.log("No more mods to sync");
      break;
    }

    const response = await Promise.all(data.map(async (mod) => saveModText(mod.id.toString(), mod.mod!)));
    if (response.some((res) => res === false)) {
      console.error("Error saving mods to DynamoDB");
      response.forEach((res, i) => {
        if (res === false) {
          console.error("Error saving mod:", data[i].id);
        }
      });
    }

    offset += limit;
  }
    
  res.status(200).json({ message: 'Sync completed' })
}