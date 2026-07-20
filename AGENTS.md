# AGENTS.md

## Runtime + package manager (do not guess)
- Node version is **22.21.1** (`.nvmrc`, CI). Use this exact major/minor for local runs.
- Package manager is **pnpm@9.15.4** (`package.json#packageManager`).
- `.npmrc` sets `legacy-peer-deps=true`; keep it, or installs may diverge from CI.

## Source-of-truth commands
- Install: `pnpm install`
- Dev server: `pnpm dev`
- Type/content validation: `pnpm check` (runs `astro check`)
- Build: `pnpm build`
- DB tooling: `pnpm db:generate`, `pnpm db:push`, `pnpm db:studio`, `pnpm db:seed`

## Verification expectations
- There is **no test script** and **no lint script** in `package.json`.
- CI quality gate is effectively: `pnpm install --frozen-lockfile` -> `pnpm astro check` -> `pnpm build`.
- If your change affects runtime/routes/content schemas, at minimum run `pnpm check`; run `pnpm build` when build/runtime behavior changed.

## Hosting
- **Production**: Cloudflare Pages (`juanoliverdotnetv4` project). Deployed via GitHub push to `main`.
- Netlify is decommissioned — repo disconnected, custom domain removed.
- Custom domain `juanoliver.net` is managed in **Cloudflare DNS** (nameservers: laylah + shane).
- DNS was previously split across Microsoft/NSOne/Cloudflare — now consolidated to Cloudflare only.

## Architecture that changes how you edit
- Astro is configured as `output: "server"` (`astro.config.mjs`).
- Adapter: **`@astrojs/cloudflare`** (Netlify and Node adapters removed).
- `locals.runtime.env` is the correct way to read env vars at runtime (not `process.env` or `import.meta.env`).
- Important route rendering modes:
  - `src/pages/index.astro` and `src/pages/servicios.astro`: `prerender = true`
  - `src/pages/tienda.astro` and `src/pages/blog/[...slug].astro`: `prerender = false` (SSR)
  - Most API endpoints are SSR; `src/pages/api/services-feed.xml.ts` is prerendered.

## Data flow hotspots
- `src/data/services.json` feeds both:
  - `/servicios` UI (`src/pages/servicios.astro`)
  - Meta/WhatsApp XML feed (`src/pages/api/services-feed.xml.ts`)
  - service items merged into `/tienda` (`src/pages/tienda.astro`)
- Product inventory merge logic lives in `src/services/products.ts`:
  - local Turso products + optional Syscom products
  - Syscom is gated by `ENABLE_SYSCOM` (disabled unless explicitly true)

## Env/config gotchas
- Build job in CI injects `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`; missing these can break DB-dependent behavior.
- `src/db/client.ts` falls back to in-memory DB if `TURSO_DATABASE_URL` is missing (easy to miss in local debugging).
- Drizzle config (`drizzle.config.ts`) expects Turso env vars for migration/push commands.
- Contact form uses Resend (`RESEND_API_KEY` secret in Cloudflare Pages). Endpoint: `src/pages/api/contact.ts`.
- Sending domain is `send.juanoliver.net` (verified in Resend). `from` address must use this subdomain.

## Automation + workflow quirks
- Social auto-publish workflow updates `.published-posts.json`; that file is a tracking artifact used by `src/scripts/process-new-posts.ts`.
- `dependency-review.yml` triggers on `develop`, while main CI uses `dev`/`main` (branch-name mismatch is intentional in current repo state—do not “fix” casually).

## Repo hygiene notes
- `.gitignore` excludes `docs/` (except `src/content/docs`) and several utility scripts; if a change “disappears,” check ignore rules before assuming tool failure.

## Demos

- Los demos se alojan en `public/demos/<nombre>/` y se sirven como archivos estáticos.
- Cada demo se construye independientemente en su propio repo y se copia al repo principal.
- Para agregar un nuevo demo, ver `docs/DEMOS.md`.
- Los demos existentes no deben modificarse desde este repo — los cambios se hacen en el repo del demo.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, invoke the `skill` tool with `skill: "graphify"` before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
