import { Database } from "./schema";

export type Tag = Database["public"]["Enums"]["tags"];

export const ALL_TAGS: Tag[] = [
  "Items",
  "Heroes",
  "Monsters",
  "Total Conversion",
  "Story",
  "Bosses",
  "WIP",
  "Tool",
  "Sandbox",
  "Mode",
  "Spells",
];
