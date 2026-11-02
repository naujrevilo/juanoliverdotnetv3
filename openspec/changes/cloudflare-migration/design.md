# Design: cloudflare-migration

## 1. `src/db/client.ts` — Factory en vez de singleton

```ts
// ANTES
export const db = drizzle(createClient({ url, authToken }), { schema });

// DESPUÉS
export function createDb(env: { TURSO_DATABASE_URL: string; TURSO_AUTH_TOKEN?: string }) {
  const client = createClient({
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  });
  return drizzle(client, { schema });
}

export type Db = ReturnType<typeof createDb>;
```

El singleton `db` desaparece. Solo existe `createDb(env)`.

---

## 2. `src/env.d.ts` — Extender `App.Locals`

```ts
/// <reference types="astro/client" />

interface ImportMetaEnv { /* ... igual que hoy ... */ }

declare namespace App {
  interface Locals {
    db: import('./db/client').Db;
    runtime: import('@astrojs/cloudflare').Runtime<Env>;
  }
}

interface Env {
  TURSO_DATABASE_URL: string;
  TURSO_AUTH_TOKEN: string;
  SYSCOM_CLIENT_ID: string;
  SYSCOM_CLIENT_SECRET: string;
  ENABLE_SYSCOM: string;
  COMMENTS_MODERATION_TOKEN: string;
  BOLD_SECRET_KEY: string;
  BOLD_IDENTITY_KEY: string;
  ALEGRA_EMAIL: string;
  ALEGRA_TOKEN: string;
}
```

---

## 3. `src/middleware/index.ts` — Nuevo archivo

```ts
import { defineMiddleware } from 'astro:middleware';
import { createDb } from '../db/client';

export const onRequest = defineMiddleware((context, next) => {
  const env = context.locals.runtime.env;
  context.locals.db = createDb({
    TURSO_DATABASE_URL: env.TURSO_DATABASE_URL,
    TURSO_AUTH_TOKEN: env.TURSO_AUTH_TOKEN,
  });
  return next();
});
```

---

## 4. Consumidores — Cambios de firma

### `src/pages/api/comments.ts` y `src/pages/api/comments/moderate.ts`
```ts
// ANTES
import { db } from '../../db/client';

// DESPUÉS
const { db } = Astro.locals; // o context.locals.db en APIRoute
```

### `src/pages/admin/comments.astro`
```astro
---
const { db } = Astro.locals;
---
```

### `src/services/products.ts`
```ts
// ANTES
export async function getLocalProducts(options?: FilterOptions): Promise<Product[]>

// DESPUÉS
export async function getLocalProducts(db: Db, options?: FilterOptions): Promise<Product[]>
```
Todas las funciones exportadas de `products.ts` reciben `db` como primer parámetro. Los llamadores pasan `locals.db`.

Las referencias a `import.meta.env?.SYSCOM_*` y `process.env.SYSCOM_*` en `products.ts` se reemplazan por un parámetro `env` opcional (o se eliminan si Syscom está fuera de producción).

---

## 5. `astro.config.mjs`

```js
// ANTES
import node from "@astrojs/node";
import netlify from "@astrojs/netlify";
const isNetlify = process.env.NETLIFY === "true";
adapter: isNetlify ? netlify() : node({ mode: "standalone" }),

// DESPUÉS
import cloudflare from "@astrojs/cloudflare";
adapter: cloudflare(),
```

Eliminar imports de `node` y `netlify`.

---

## 6. `wrangler.toml` — Nuevo archivo en raíz

```toml
name = "juanoliver-net"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = "./dist"
```

`nodejs_compat` es requerido para que `@libsql/client` funcione en Workers (usa APIs de Node como `crypto`).

---

## 7. Variables de entorno en Cloudflare Pages

Configurar en el dashboard de Cloudflare Pages → Settings → Environment Variables:

| Variable | Tipo |
|---|---|
| `TURSO_DATABASE_URL` | Secret |
| `TURSO_AUTH_TOKEN` | Secret |
| `COMMENTS_MODERATION_TOKEN` | Secret |
| `BOLD_SECRET_KEY` | Secret |
| `BOLD_IDENTITY_KEY` | Secret |
| `ALEGRA_EMAIL` | Secret |
| `ALEGRA_TOKEN` | Secret |
| `ENABLE_SYSCOM` | Variable (plain) |
| `PUBLIC_SITE_URL` | Variable (plain) |
| `PUBLIC_GA_ID` | Variable (plain) |

---

## 8. Paquetes

```bash
pnpm remove @astrojs/node @astrojs/netlify
pnpm add @astrojs/cloudflare
```

---

## Gotchas

- `nodejs_compat` en `wrangler.toml` es **obligatorio** — sin esto `@libsql/client` falla en runtime con error de `crypto`.
- El middleware corre en **cada request**, incluyendo assets estáticos si no se filtra. Agregar guard: `if (context.request.url.includes('/_astro/')) return next();` si hay problemas de performance.
- `prerender = true` en `index.astro` y `servicios.astro` — esas páginas no pasan por middleware en runtime, lo cual está bien porque no necesitan DB.
- Drizzle + libSQL no usa connection pooling; crear el cliente por request es el patrón correcto para edge.
