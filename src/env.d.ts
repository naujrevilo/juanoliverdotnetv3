/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

/**
 * Build-time / Node adapter env vars — available via `import.meta.env`.
 *
 * NOTE: In the Cloudflare adapter, runtime secrets are NOT available here.
 * They come from `context.locals.runtime.env` (see {@link CloudflareEnv}).
 * These declarations exist mainly for local dev (Node adapter) and `astro check`.
 */
interface ImportMetaEnv {
  readonly TURSO_DATABASE_URL: string;
  readonly TURSO_AUTH_TOKEN: string;
  readonly PUBLIC_SITE_URL: string;
  readonly PUBLIC_GA_ID: string;
  readonly BOLD_SECRET_KEY: string;
  readonly BOLD_IDENTITY_KEY: string;
  readonly ALEGRA_EMAIL: string;
  readonly ALEGRA_TOKEN: string;
  readonly SYSCOM_CLIENT_ID: string;
  readonly SYSCOM_CLIENT_SECRET: string;
  readonly ENABLE_SYSCOM: string;
  readonly COMMENTS_MODERATION_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * Cloudflare Pages bindings — injected per-request by the CF adapter into
 * `context.locals.runtime.env`. This is the ONLY reliable way to access
 * secrets at runtime when deployed to Cloudflare Pages/Workers.
 *
 * Mirror of {@link ImportMetaEnv}; keep both in sync manually when adding
 * or removing env vars.
 */
type CloudflareEnv = {
  TURSO_DATABASE_URL: string;
  TURSO_AUTH_TOKEN: string;
  PUBLIC_SITE_URL: string;
  PUBLIC_GA_ID: string;
  BOLD_SECRET_KEY: string;
  BOLD_IDENTITY_KEY: string;
  ALEGRA_EMAIL: string;
  ALEGRA_TOKEN: string;
  SYSCOM_CLIENT_ID: string;
  SYSCOM_CLIENT_SECRET: string;
  ENABLE_SYSCOM: string;
  COMMENTS_MODERATION_TOKEN: string;
};

declare namespace App {
  interface Locals {
    db: import("./db/client").Db;
    runtime: {
      env: CloudflareEnv;
    };
  }
}
