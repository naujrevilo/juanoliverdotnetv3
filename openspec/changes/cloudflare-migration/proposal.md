# Proposal: Cloudflare Pages Migration

## Intent

Migrate the current Astro SSR adapter from Node/Netlify to Cloudflare Pages (`@astrojs/cloudflare`). This resolves environment variable scoping issues where `@libsql/client` module-level initialization fails in Workers due to env vars (`TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`) only being accessible within the request handler.

## Scope

### In Scope
- Refactor `src/db/client.ts` to export a factory function `createDb(env)`.
- Implement Astro Middleware (`src/middleware/index.ts`) to initialize `db` per-request via `context.locals.db`.
- Refactor 4 direct consumers of `db` to read from `Astro.locals.db` or receive it as a parameter.
- Update `astro.config.mjs` to use the Cloudflare adapter.
- Add `wrangler.toml` for CF Pages configuration.
- Define `App.Locals` interface in `src/env.d.ts`.

### Out of Scope
- Integration or modifications to the Syscom cache system.
- Changes to the Drizzle database schema.
- UI or structural changes to existing Astro routes.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- None

## Approach

We will implement the Astro Middleware pattern. The `db` singleton in `src/db/client.ts` will be replaced with a `createDb(env)` factory. A new `src/middleware/index.ts` will intercept requests, extract CF environment variables from `context.locals.runtime.env`, instantiate the database client, and attach it to `context.locals.db`. Dependent files will be updated to consume this context-aware instance.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/db/client.ts` | Modified | Change singleton to `createDb(env)` factory |
| `src/middleware/index.ts` | New | Intercept requests and set `context.locals.db` |
| `src/env.d.ts` | Modified | Add `db` to `App.Locals` interface |
| `src/services/products.ts` | Modified | Accept `db` as a function parameter |
| `src/pages/admin/comments.astro` | Modified | Read `db` from `Astro.locals.db` |
| `src/pages/api/comments.ts` | Modified | Read `db` from `context.locals.db` |
| `src/pages/api/comments/moderate.ts`| Modified | Read `db` from `context.locals.db` |
| `astro.config.mjs` | Modified | Swap adapter to `@astrojs/cloudflare` |
| `wrangler.toml` | New | Cloudflare Pages bindings and config |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Type errors missing `Astro.locals` | Low | Explicitly define `App.Locals` in `src/env.d.ts` |
| Cloudflare SSR timeout/limits | Low | The endpoints only execute lightweight Turso queries |

## Rollback Plan

Revert `astro.config.mjs` back to the Node/Netlify adapter configuration, remove `wrangler.toml`, and restore the `db` singleton export in `src/db/client.ts`.

## Dependencies

- `@astrojs/cloudflare` npm package.
- Cloudflare Pages account / Wrangler CLI.

## Success Criteria

- [ ] `pnpm check` and `pnpm build` pass locally.
- [ ] The 4 modified DB consumers execute queries without connection or type errors.
- [ ] `TURSO_DATABASE_URL` is correctly read per-request in the Cloudflare Pages environment.
