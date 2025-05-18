import { TextmodCardProps } from "@/components";
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { Resource } from "sst";
import { Database } from "./schema";
import { strToU8, compressSync, decompressSync } from "fflate";

export async function saveModText(id: string, modText: string) {
  if (!id) {
    console.log("No id found");
    return false;
  }
  if (!modText) {
    console.log("No mod text found");
    return false;
  }

  console.log("Setting cached data");
  const client = new DynamoDBClient();

  console.log("start Compressing");

  try {
    let input = strToU8(modText);
    const d = compressSync(input, { level: 9, mem: 6 });
    const compressed = Buffer.from(d).toString("base64");
    const full = modText.length;
    const compressedSize = compressed.length;
    console.log(
      `Compressed data comparison: ${full} to ${compressed} (${Math.round(
        (compressedSize / full) * 100
      )}%)`
    );

    const command = new PutItemCommand({
      TableName: Resource.ModCache.name,
      Item: {
        type: { S: "mod" },
        id: { S: id.toString() },
        modData: { S: JSON.stringify(compressed) },
      },
    });

    await client.send(command);
  } catch (e) {
    console.log("Error compressing");
    console.log(id);
    console.log(e);
    return false;
  }

  console.log("done", id);
  return true;
}

export const getModText = async (id: string) => {
  const client = new DynamoDBClient();

  const command = new GetItemCommand({
    TableName: Resource.ModCache.name,
    Key: {
      type: { S: "mod" },
      id: { S: id.toString() },
    },
    ProjectionExpression: "modData",
  });

  const response = await client.send(command);
  const item = response.Item;
  if (!item) {
    return undefined;
  }

  const modBuff = Buffer.from(item.modData.S!, "base64");
  const decompressed = decompressSync(modBuff);
  return new TextDecoder("utf-8").decode(decompressed);
};
