/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly TURSO_DATABASE_URL: string;
  readonly TURSO_AUTH_TOKEN: string;
  readonly PUBLIC_SITE_URL: string;
  readonly PUBLIC_GA_ID: string;
  readonly BOLD_SECRET_KEY: string;
  readonly BOLD_IDENTITY_KEY: string;
  readonly ALEGRA_EMAIL: string;
  readonly ALEGRA_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
