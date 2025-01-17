import { Resource } from "sst";
import {
  DynamoDBClient,
  ScanCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { TextmodCardProps } from "@/components";
import { generateSupabaseClient } from "@/utils/supabase";
import type { NextApiRequest, NextApiResponse } from "next";
import { compress, decompress } from "brotli-unicode";
import { TextmodsQuery } from "@/hooks/useTextmodsQuery";

type ResponseData = {
  data?: Array<TextmodCardProps>;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { table, query } = req.query;

  if (!table) {
    return res.status(400).json({ message: "Table name is required" });
  }
  if (Array.isArray(table)) {
    return res.status(400).json({ message: "Table name must be a string" });
  }
  console.log({ table });

  let tmQuery:TextmodsQuery | undefined = undefined;
  if (query &&  ) {
  }


  const fullTable = `${table}-full`;

  const items = await getCachedData(fullTable);

  console.log({ items });

  if (items && items.length > 0) {
    console.log("Sending data 1");
    // @ts-ignore
    return res.status(200).json({ data: items });
  }

  const { data, error } = await getLiveData(table);

  console.log({ error });

  if (error) {
    return res.status(500).json({ message: error });
  }

  if (!data) {
    return res.status(404).json({ message: "No data found" });
  }

  await Promise.all(data.map((d, i) => setCachedData(fullTable, d, i)));

  // await setCachedData(fullTable, data);

  console.log("Sending data 2");
  res.status(200).json({ data });
}

async function getCachedData(table: string) {
  console.log("Getting cached data from " + table);
  const client = new DynamoDBClient();

  // get all items that have the same table name
  const command = new ScanCommand({
    TableName: Resource.DbCache.name,
    FilterExpression: "#dbTable = :table",
    ExpressionAttributeValues: {
      ":table": { S: table },
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

async function setCachedData(
  table: string,
  data: TextmodCardProps,
  index: number
) {
  console.log("Setting cached data");
  const client = new DynamoDBClient();

  // create ttl for 3 hours, in seconds
  const ttl = Math.floor(Date.now() / 1000) + 60 * 60 * 3;

  console.log("start Compressing");

  try {
    const modified = {... data};
    let input = Buffer.from(data.mod);
    // @ts-ignore
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
    console.log(data.name)
    console.log(e);
  }

  console.log("done", index);
}

async function getLiveData(
  table: string
): Promise<{ error?: string; data?: Array<TextmodCardProps> }> {
  console.log("Getting live data");
  const supabase = generateSupabaseClient();

  const { data, error } = await supabase
    .from(table)
    .select("*, mods(*, mod_votes(*), mod_comments(count), user_id(username))")
    .limit(10);

  if (error) {
    return { error: error.message };
  }

  const fixedData = data.map((row) => {
    // Forgive me, for this is the only way to make this work
    // The data returned from Supabase is correct, but the logic they have for types is broken
    //@ts-ignore
    const realMod = row.mods;
    return {
      //@ts-ignore
      commentCount: realMod.mod_comments[0].count,
      //@ts-ignore
      createdDate: new Date(realMod.created_at),
      creator: {
        name: realMod.user_id.username,
        //@ts-ignore
        slug: realMod.user_id.username.toLowerCase().replace(" ", "-"),
      },
      //@ts-ignore
      description: realMod.description,
      //@ts-ignore
      downvotes: realMod.mod_votes.filter(
        ({ upvote }: { upvote: boolean }) => !upvote
      ).length,
      //@ts-ignore
      name: realMod.name,
      //@ts-ignore
      upvotes: realMod.mod_votes.filter(
        ({ upvote }: { upvote: boolean }) => upvote
      ).length,
      //@ts-ignore
      id: realMod.id,
      //@ts-ignore
      mod: realMod.mod,
    } as TextmodCardProps;
  });

  return { data: fixedData };
}
