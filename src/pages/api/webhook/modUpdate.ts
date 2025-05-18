import { saveModText } from "@/utils/dynamo";
import { Database, Tables } from "@/utils/schema";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = Record<string, unknown>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // get the request headers
  const headers = req.headers;
  const { "webhook-key": webhookKey } = headers;

  // check if the webhook key is set
  if (!webhookKey) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  // check if the webhook key is correct
  if (webhookKey !== process.env.SUPABASE_WEBHOOK_KEY) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  // Check if the request body is a valid DbPayload
  if (!isDbPayload(req.body)) {
    res.status(400).json({ message: "Invalid payload" });
    return;
  }

  const result = await saveModText(req.body.record)

  return result
    ? res.status(200).json({ message: "Success" })
    : res.status(400).json({ message: "Failed to save mod" });
}


type DbPayload = {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  schema: string
  record: Database['public']['Tables']['mods']['Row']
  old_record: null
}

//create a typeguard to check if the item is Database['public']['Tables']['mods']['Row']
function isDbRow(item: any): item is Database['public']['Tables']['mods']['Row'] {
  return (
    item &&
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.user_id === 'string' &&
    typeof item.created_at === 'string' &&
    typeof item.mod === 'object'
  );
}

//create a typeguard to check if the payload is a DbPayload
function isDbPayload(payload: any): payload is DbPayload {
  return (
    payload &&
    typeof payload.type === 'string' &&
    (payload.type === 'INSERT' || payload.type === 'UPDATE' || payload.type === 'DELETE') &&
    typeof payload.table === 'string' &&
    typeof payload.schema === 'string' &&
    typeof isDbRow(payload.record) &&
    (payload.old_record === null || typeof payload.old_record === 'object')
  );
}