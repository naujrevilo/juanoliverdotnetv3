# Infrastructure Specification

## Purpose

Specifies the Cloudflare Pages adapter and per-request database context initialization for Astro SSR.

## Requirements

### Requirement: Cloudflare Pages Adapter

The system MUST use `@astrojs/cloudflare` as the Astro adapter to build and deploy to Cloudflare Pages.

#### Scenario: Production build

- GIVEN the application is configured for SSR
- WHEN running `pnpm build`
- THEN the Astro build process MUST generate a Cloudflare Pages compatible output
- AND a `wrangler.toml` file MUST exist for Cloudflare configuration

### Requirement: Per-Request Database Client Initialization

The system MUST instantiate the `@libsql/client` per-request using Cloudflare environment variables to prevent module-level initialization errors in Workers.

#### Scenario: Incoming Request

- GIVEN an incoming HTTP request
- WHEN the Astro Middleware intercepts the request
- THEN it MUST extract `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` from `context.locals.runtime.env`
- AND it MUST instantiate the `db` client
- AND it MUST attach the `db` instance to `context.locals.db`

### Requirement: Consumer Database Access

Application endpoints and components MUST access the database instance via `Astro.locals.db` or receive it as a parameter, rather than importing a singleton.

#### Scenario: Astro Component Access

- GIVEN an `.astro` page requiring database access (e.g., `src/pages/admin/comments.astro`)
- WHEN the component renders
- THEN it MUST read the database instance from `Astro.locals.db`

#### Scenario: API Endpoint Access

- GIVEN an API endpoint requiring database access (e.g., `src/pages/api/comments.ts`)
- WHEN the endpoint executes
- THEN it MUST read the database instance from `context.locals.db`

#### Scenario: Service Layer Access

- GIVEN a service function requiring database access (e.g., `src/services/products.ts`)
- WHEN the function is called
- THEN it MUST accept the database instance as an explicit parameter
