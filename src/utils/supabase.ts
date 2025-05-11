import { createClient } from "@supabase/supabase-js";
import { atom } from "jotai";
import { TextmodCardProps } from "@/components";
import { Database } from "./schema";

export const generateSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!supabaseKey) {
    throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return createClient<Database>(supabaseUrl, supabaseKey);
};

export const supabase = generateSupabaseClient();

const coreSupabaseAtom = atom(supabase);
export const supabaseAtom = atom((get) => get(coreSupabaseAtom));

export const getModTextmod = async (id: number) => {
  const { data, error } = await supabase
    .from("mods")
    .select("mod")
    .eq("id", id)
    .single();
  if (error) {
    console.error("Error fetching mod textmod:", error);
    return null;
  }
  return data?.mod;
};

export const sbToTextmods = (data: any) => {
  const fixedData: Array<TextmodCardProps> = data.map((row: any) => {
    // Forgive me, for this is the only way to make this work
    // The data returned from Supabase is correct, but the logic they have for types is broken
    //@ts-ignore

    const realMod = row;
    const { mod, ...rest } = realMod;

    console.log({ rest });

    const fix = {
      //@ts-ignore
      commentCount: Object.hasOwn(realMod, "mod_comments")
        ? realMod.mod_comments[0].count
        : 0,
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

    return fix;
  });

  return fixedData;
};
