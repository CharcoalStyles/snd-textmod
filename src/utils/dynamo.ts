import { TextmodCardProps } from "@/components";
import {
  DynamoDBClient,
  ScanCommand,
  PutItemCommand,
  BatchGetItemCommand
} from "@aws-sdk/client-dynamodb";
import { Resource } from "sst";
import { Database } from "./schema";
import { strToU8, compressSync, decompressSync } from "fflate";


export async function saveMod(
  mod: Database["public"]["Tables"]["mods"]["Row"]
) {
  if (!mod) {
    console.log("No data to save");
    return false;
  }
  if (!mod.mod) {
    console.log("No mod to save");
    return false;
  }
  if (!mod.id) {
    console.log("No id to save");
    return false;
  }
  if (!mod.name) {
    console.log("No name to save");
    return false;
  }
  if (!mod.user_id) {
    console.log("No user_id to save");
    return false;
  }
  if (!mod.created_at) {
    console.log("No created_at to save");
    return false;
  }
  console.log("Setting cached data");
  const client = new DynamoDBClient();

  console.log("start Compressing");

  try {
    const modified = { ...mod };
    let input = strToU8(mod.mod);
    const d = compressSync(input, { level: 9, mem: 6  });
    modified.mod = Buffer.from(d).toString("base64");  
    const full = mod.mod.length;
    const compressed = modified.mod.length;
    console.log(
      `Compressed data comparison: ${full} to ${compressed} (${Math.round(
        (compressed / full) * 100
      )}%)`
    );  

    const command = new PutItemCommand({
      TableName: Resource.ModCache.name,
      Item: {
        type: { S: "mod" },
        id: { S: mod.id.toString() },
        modData: { S: JSON.stringify(modified) },
      },
    });

    await client.send(command);
  } catch (e) {
    console.log("Error compressing");
    console.log(mod.id);
    console.log(mod.name);
    console.log(e);
    return false;
  }

  console.log("done", mod.id);
  return true;
}

export const getMods = async (ids:Array<string>) => {
  const client = new DynamoDBClient();

  const command = new BatchGetItemCommand({
    RequestItems: {
      [Resource.ModCache.name]: {
        Keys: ids.map((id) => ({
          type: { S: "mod" },
          id: { S: id },
        })),
        ProjectionExpression: "id, modData",
      },
    },
  });

  const response = await client.send(command);
  if (!response.Responses) {
    return [];
  }

  return response.Responses[Resource.ModCache.name].map((item) => {
    const modData = item.modData.S;
    if (!modData) {
      console.log("No data found");
      return null;
    }
    const parsedData = JSON.parse(modData) as Omit<Database["public"]["Tables"]["mods"]["Row"], 'mod'> & { mod: string };
    if (!parsedData) {
      console.log("No parsed data found");
      return null;
    }

    const {mod, ...rest} = parsedData;

    const modBuff = Buffer.from(parsedData.mod, "base64");
    const decompressed = decompressSync(modBuff);
    const decompressedString = new TextDecoder("utf-8").decode(decompressed);
    const fullMod: Database["public"]["Tables"]["mods"]["Row"] = {
      ...rest,
      mod: decompressedString,
    };
    return fullMod;
  });
}
