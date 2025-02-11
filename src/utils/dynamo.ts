import { TextmodCardProps } from "@/components";
import {
  DynamoDBClient,
  ScanCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { Resource } from "sst";
import { compress, decompress } from "brotli-unicode";

export async function getCachedTextmod_old(key: string) {
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

export async function setCachedTextmod_old(
  table: string,
  data: TextmodCardProps,
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

export async function setCachedTextmod(id: number, mod: string) {
  console.log(`Saving mod ID ${id}`);
  const client = new DynamoDBClient();

  console.log("start Compressing");

  try {
    let input = Buffer.from(mod);
    const d = await compress(input);
    const full = mod.length;
    const compressed = d.toString().length;
    console.log(
      `mod #${id} compression: ${full} to ${compressed} (${Math.round(
        (compressed / full) * 100
      )}%)`
    );

    const command = new PutItemCommand({
      TableName: Resource.DbCache.name,
      Item: {
        dbTable: { S: "modtext" },
        dbQuery: { S: id.toString() },
        data: { S: d.toString() },
      },
    });

    await client.send(command);
  } catch (e) {
    console.log("Error compressing");
    console.log(id);
    console.log(e);
  }
}

export async function getCachedTextmod(id: number) {
  console.log("Getting modtext for ID " + id);
  const client = new DynamoDBClient();

  // get all items that have the same table name
  const command = new ScanCommand({
    TableName: Resource.DbCache.name,
    FilterExpression: "#dbTable = :table AND #dbQuery = :query",
    ExpressionAttributeValues: {
      ":table": { S: "modtext" },
      ":query": { S: id.toString() },
    },
    ExpressionAttributeNames: { "#dbTable": "dbTable", "#dbQuery": "dbQuery" },
  });

  const { Items } = await client.send(command);
  console.log(Items);

  if (!Items || Items.length === 0) {
    return null;
  }

  const data = Items[0].data.S;
  if (!data) {
    return null;
  }

  const decompressed = await decompress(data);
  const output = Buffer.from(decompressed);
  
  console.log("Got modtext");
  return output.toString();
}
