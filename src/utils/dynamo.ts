import { TextmodCardProps } from "@/components";
import {
  DynamoDBClient,
  ScanCommand,
  PutItemCommand,
  GetItemCommand,
} from "@aws-sdk/client-dynamodb";
import { Resource } from "sst";
import { compress, decompress } from "brotli-unicode";
import { gzipSync, gunzipSync } from "zlib";

export async function getCachedTextmod(key: string) {
  console.log("Getting cached data from " + key);
  const client = new DynamoDBClient();

  // get all items that have the same table name
  const command = new ScanCommand({
    TableName: Resource.DbCache.name,
    FilterExpression: "#dbTable = :table",
    ExpressionAttributeValues: {
      ":table": { S: key },
    },
    ExpressionAttributeNames: { "#dbTable": "dbTable" },
  });

  const { Items } = await client.send(command);

  if (!Items) {
    return [];
  }

  const data = await Promise.all(
    Items.map(async (item, i) => {
      const d = item.data.S;
      if (!d) {
        return null;
      }
      const data = JSON.parse(d) as TextmodCardProps;

      // @ts-ignore
      const decompressed = await decompress(data.mod);
      const output = Buffer.from(decompressed);

      return {
        ...data,
        mod: output.toString(),
      };
    })
  );

  console.log("Got cached data");
  return data;
}

export async function setCachedTextmod(
  table: string,
  data: TextmodCardProps & { mod: string },
  index: number
) {
  console.log("Setting cached data");
  const client = new DynamoDBClient();

  // create ttl for 1 hour, in seconds
  const ttl = Math.floor(Date.now() / 1000) + 60 * 60;

  console.log("start Compressing");

  try {
    const modified = { ...data };
    let input = Buffer.from(data.mod);
    const d = await compress(input);
    const full = data.mod.length;
    const compressed = d.toString().length;
    console.log(
      `Compressed data comparison: ${full} to ${compressed} (${Math.round(
        (compressed / full) * 100
      )}%)`
    );

    modified.mod = d;

    const command = new PutItemCommand({
      TableName: Resource.DbCache.name,
      Item: {
        dbTable: { S: table },
        dbQuery: { S: index.toString() },
        data: { S: JSON.stringify(modified) },
        ttl: { N: ttl.toString() },
      },
    });

    await client.send(command);
  } catch (e) {
    console.log("Error compressing");
    console.log(index);
    console.log(data.name);
    console.log(e);
  }

  console.log("done", index);
}

export async function getCachedModText(id: number) {
  const client = new DynamoDBClient();

  const { Item } = await client.send(
    new GetItemCommand({
      TableName: Resource.ModCache.name,
      Key: { type: { S: "mod" }, id: { S: id.toString() } },
    })
  );

  const modData = Item?.modData?.S;
  if (!modData) {
    return null;
  }

  const base64 = JSON.parse(modData) as string;
  return gunzipSync(Buffer.from(base64, "base64")).toString();
}

export async function setCachedModText(id: number, mod: string) {
  const client = new DynamoDBClient();
  const base64 = gzipSync(Buffer.from(mod)).toString("base64");

  await client.send(
    new PutItemCommand({
      TableName: Resource.ModCache.name,
      Item: {
        type: { S: "mod" },
        id: { S: id.toString() },
        modData: { S: JSON.stringify(base64) },
      },
    })
  );
}
