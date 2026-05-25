import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

/**
 * Factory that creates a Drizzle DB client bound to the given runtime env.
 *
 * **Why a factory instead of a singleton?**
 * The Cloudflare adapter does NOT expose runtime secrets via `import.meta.env`
 * at request time — they are only available through
 * `context.locals.runtime.env`, which is injected fresh on every request.
 * This factory is therefore called in middleware (`src/middleware/index.ts`)
 * once per request, not at module level.
 *
 * **Do NOT call this at the top of a module with `import.meta.env`** — those
 * values will be `undefined` in the Cloudflare Workers runtime.
 *
 * @param env - Runtime environment bindings (Cloudflare Workers / Turso)
 * @param env.TURSO_DATABASE_URL - libSQL connection URL (e.g. `libsql://...` or `file:local.db`)
 * @param env.TURSO_AUTH_TOKEN - Optional for local `file://` URLs; required for remote Turso databases
 */
export function createDb(env: {
  TURSO_DATABASE_URL: string;
  TURSO_AUTH_TOKEN?: string;
}) {
  const client = createClient({
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  });
  return drizzle(client, { schema });
}

/** Inferred return type of {@link createDb}. Use this for typing `locals.db`. */
export type Db = ReturnType<typeof createDb>;
