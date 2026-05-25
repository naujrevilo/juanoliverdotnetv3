import { defineMiddleware } from "astro:middleware";
import { createDb } from "../db/client";

/**
 * Per-request middleware: resolves Cloudflare runtime env bindings and
 * bootstraps a Drizzle DB client, attaching it to `locals.db`.
 *
 * **Why here and not at module level?**
 * The Cloudflare adapter injects env bindings into
 * `context.locals.runtime.env` on every request — they are NOT available
 * via `import.meta.env` for runtime secrets in the CF adapter. `createDb`
 * must therefore be called here, not at the top of a module.
 *
 * **Downstream consumers:** any page or API route can access the DB via
 * `const { db } = Astro.locals` — never import or instantiate `createDb`
 * directly in a page or route.
 */
export const onRequest = defineMiddleware((context, next) => {
  const env = context.locals.runtime.env;
  context.locals.db = createDb({
    TURSO_DATABASE_URL: env.TURSO_DATABASE_URL,
    TURSO_AUTH_TOKEN: env.TURSO_AUTH_TOKEN,
  });
  return next();
});
