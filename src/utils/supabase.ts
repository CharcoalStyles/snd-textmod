
import { createClient } from "@supabase/supabase-js";
import { atom } from "jotai";
import { Database } from "./schema";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
    throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
}

if (!supabaseKey) {
    throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)


const coreSupabaseAtom = atom(supabase);
export const supabaseAtom = atom((get) => get(coreSupabaseAtom));
