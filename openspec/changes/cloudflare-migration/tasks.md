# Tasks: cloudflare-migration

## Orden de implementación (por dependencia)

### T1 — Instalar/desinstalar paquetes
**Comandos:**
```bash
pnpm remove @astrojs/node @astrojs/netlify
pnpm add @astrojs/cloudflare
```
**Estimación:** 2 líneas (package.json diff)
**Verificación:** `pnpm install --frozen-lockfile` pasa sin errores

---

### T2 — Refactorizar `src/db/client.ts`
Reemplazar el singleton `db` por una factory `createDb(env)` y exportar el tipo `Db`.
- Eliminar llamada top-level a `createClient()`
- Eliminar función `getEnv()` y toda la lógica de fallback
- Exportar `createDb(env: { TURSO_DATABASE_URL: string; TURSO_AUTH_TOKEN?: string })`
- Exportar `type Db = ReturnType<typeof createDb>`

**Estimación:** ~25 líneas cambiadas (archivo actual: 62 líneas)
**Verificación:** TypeScript no reporta errores en este archivo

---

### T3 — Actualizar `src/env.d.ts`
- Agregar `interface Env` con todas las variables de entorno de Cloudflare
- Agregar `declare namespace App { interface Locals { db: Db; runtime: Runtime<Env> } }`
- Agregar `/// <reference types="@astrojs/cloudflare" />`

**Estimación:** ~20 líneas agregadas
**Verificación:** `pnpm check` pasa

---

### T4 — Crear `src/middleware/index.ts`
Nuevo archivo. `defineMiddleware` que:
1. Lee `context.locals.runtime.env`
2. Llama `createDb({ TURSO_DATABASE_URL, TURSO_AUTH_TOKEN })`
3. Asigna resultado a `context.locals.db`
4. Llama `next()`

**Estimación:** ~15 líneas
**Verificación:** `pnpm check` pasa

---

### T5 — Actualizar `src/services/products.ts`
- `getLocalProducts(db, options?)` — agregar `db: Db` como primer parámetro
- `getExternalProducts(options?)` — sin cambio (no usa DB)
- `getAllProducts(db, options?)` — agregar `db: Db`, pasar a `getLocalProducts`
- `checkProductStock()` — sin cambio (no usa DB)
- `generateSyscomQuote()` — sin cambio (no usa DB)
- Eliminar `import { db } from '../db/client'`
- Limpiar `import.meta.env?.SYSCOM_*` y `process.env.SYSCOM_*` — reemplazar por `import.meta.env.SYSCOM_CLIENT_ID` (build-time está ok para Syscom ya que es feature-flagged y no está en producción)

**Estimación:** ~20 líneas cambiadas
**Verificación:** `pnpm check` pasa

---

### T6 — Actualizar `src/pages/admin/comments.astro`
- Eliminar `import { db } from '../../db/client'`
- Agregar `const { db } = Astro.locals`

**Estimación:** ~3 líneas cambiadas
**Verificación:** `pnpm check` pasa

---

### T7 — Actualizar `src/pages/api/comments.ts`
- Eliminar `import { db } from '../../db/client'`
- Obtener `db` de `context.locals.db` dentro del handler

**Estimación:** ~5 líneas cambiadas
**Verificación:** `pnpm check` pasa

---

### T8 — Actualizar `src/pages/api/comments/moderate.ts`
- Eliminar `import { db } from '../../../db/client'`
- Obtener `db` de `context.locals.db` dentro del handler

**Estimación:** ~5 líneas cambiadas
**Verificación:** `pnpm check` pasa

---

### T9 — Actualizar `astro.config.mjs`
- Eliminar imports de `@astrojs/node` y `@astrojs/netlify`
- Eliminar variable `isNetlify`
- Reemplazar `adapter: isNetlify ? netlify() : node({ mode: "standalone" })` por `adapter: cloudflare()`
- Agregar `import cloudflare from "@astrojs/cloudflare"`

**Estimación:** ~8 líneas cambiadas
**Verificación:** `pnpm check` pasa

---

### T10 — Crear `wrangler.toml`
Nuevo archivo en la raíz del repo:
```toml
name = "juanoliver-net"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = "./dist"
```
`nodejs_compat` es **obligatorio** para `@libsql/client`.

**Estimación:** 5 líneas
**Verificación:** `pnpm build` genera `dist/` sin errores

---

### T11 — Verificación final
```bash
pnpm check
pnpm build
```
Confirmar que `dist/` tiene estructura compatible con Cloudflare Pages (`_worker.js` o `functions/`).

---

## Review Workload Forecast

| Task | Líneas estimadas |
|------|-----------------|
| T1 — Paquetes | 2 |
| T2 — db/client.ts | 25 |
| T3 — env.d.ts | 20 |
| T4 — middleware | 15 |
| T5 — products.ts | 20 |
| T6 — comments.astro | 3 |
| T7 — comments.ts | 5 |
| T8 — moderate.ts | 5 |
| T9 — astro.config.mjs | 8 |
| T10 — wrangler.toml | 5 |
| **Total** | **~108 líneas** |

**Budget: 400 líneas — Dentro del límite ✅**
**PR único recomendado.**
**Decision needed before apply: No**
