import { TriggerClient } from "@trigger.dev/sdk";

export const client = new TriggerClient({
  id: "snd-textmod-yABO",
  apiKey: process.env.TRIGGER_API_KEY,
  apiUrl: process.env.TRIGGER_API_URL,
});
