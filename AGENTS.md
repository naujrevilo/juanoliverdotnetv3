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

## Architecture that changes how you edit
- Astro is configured as `output: "server"` (`astro.config.mjs`).
- Adapter is environment-switched:
  - `NETLIFY=true` -> Netlify adapter
  - otherwise -> Node standalone adapter
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

## Automation + workflow quirks
- Social auto-publish workflow updates `.published-posts.json`; that file is a tracking artifact used by `src/scripts/process-new-posts.ts`.
- `dependency-review.yml` triggers on `develop`, while main CI uses `dev`/`main` (branch-name mismatch is intentional in current repo state—do not “fix” casually).

## Repo hygiene notes
- `.gitignore` excludes `docs/` (except `src/content/docs`) and several utility scripts; if a change “disappears,” check ignore rules before assuming tool failure.
