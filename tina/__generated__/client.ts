import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ cacheDir: 'D:/juanoliverdotnetv3/tina/__generated__/.cache/1769877272505', url: '/.netlify/functions/tina', token: 'null', queries,  });
export default client;
  