import { createClient } from "@supabase/supabase-js";
import { atom } from "jotai";
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

  return createClient(supabaseUrl, supabaseKey);
};

export const supabase = generateSupabaseClient();

const coreSupabaseAtom = atom(supabase);
export const supabaseAtom = atom((get) => get(coreSupabaseAtom));
