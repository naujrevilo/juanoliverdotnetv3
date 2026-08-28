# Demos — arquitectura

## Concepto

Cada demo es un **proyecto independiente de Cloudflare Pages** con su propio URL `*.pages.dev`. El sitio principal (`juanoliver.net`) **no sirve contenido de demos localmente** — solo expone un catch-all redirect que apunta al Pages project de cada demo.

### Por qué cada demo es standalone

- **Build desacoplado**: cambiar un demo no fuerza rebuild del sitio principal.
- **Tamaño**: el bundle del sitio principal no crece con cada demo.
- **Aislamiento**: un deploy roto de un demo no rompe el sitio principal.
- **Direct Upload de CF Pages** (que es lo que rompió las rutas en el pasado) ya no aplica porque cada demo tiene su propio project.

## Routing

```
https://juanoliver.net/demos/<nombre>/<subpath>
        |
        | SSR — Cloudflare Worker (Astro)
        v
[...name].astro: catch-all redirect (301)
        |
        v
https://<nombre>.pages.dev/<subpath>     (o https://<nombre>.pages.dev/ si subpath vacío)
```

El Worker del sitio principal ejecuta `src/pages/demos/[...name].astro` y devuelve un 301 al Pages project del demo. El subpath se preserva.

## Mapa actual de demos

| Slug | Pages project URL | Repo |
|---|---|---|
| `galaxynews` | `https://galaxynews.pages.dev` | `https://github.com/naujrevilo/galaxynews` (independiente) |
| `newspaper` | `https://mynewspaper.pages.dev` | `https://github.com/naujrevilo/myNewspaper` (independiente) |

El mapa vive en `src/pages/demos/[...name].astro` como `DEMO_URLS`:

```ts
const DEMO_URLS: Record<string, string> = {
  newspaper: "https://mynewspaper.pages.dev",
  galaxynews: "https://galaxynews.pages.dev",
};
```

## Cómo agregar un demo nuevo

1. **Deployar el demo como Pages project propio.** Crear el proyecto en Cloudflare Dashboard (`Workers & Pages > Create > Pages > Connect to Git`). Configurar build command y output dir segun el framework del demo. Confirmar que responde 200 OK en `https://<demo>.pages.dev/`.

2. **Agregar la URL al `DEMO_URLS`** en `src/pages/demos/[...name].astro`. Sin esto, las visitas a `/demos/<demo>/` caen en `Astro.redirect("/404", 302)`.

3. **Commit + push a `main`** del sitio principal. El CF Pages del sitio principal (`juanoliver-net`) redeployá el Worker; el catch-all empieza a redirigir.

4. **Actualizar el proyecto en `src/content/projects/`** si querés que aparezca enlazado desde `/proyectos`. Cambiar el campo `demoUrl` a la URL real del Pages project (no a `/demos/<demo>/`).

## Por qué `output: "static"` y sin adapter de Cloudflare

Para Astro con `output: "static"` no se necesita adapter de Cloudflare (ni `@astrojs/cloudflare` ni ningún otro). El adapter es solo para SSR/scheduled functions.

El adapter `@astrojs/cloudflare` v14, incluso con output estático, genera `dist/server/.prerender/wrangler.json` con bindings (`IMAGES`, `SESSION`, `ASSETS` reservado) que rompen el build de Pages. Sin adapter, el build emite `dist/` limpio.

## Configuración Pages project (dashboard de CF)

Para cada Pages project de un demo:

| Campo | Valor típico |
|---|---|
| Build command | `pnpm build` (o lo que use el framework) |
| Build output directory | `dist` (sin adapter de CF) o `dist/client` (con adapter v14 y `output: "static"`) |
| Root directory | `/` |
| Compatibility flags | `nodejs_compat` si el demo lo necesita |
| Environment variables | las que requiera el demo (API keys, etc.) |

## `wrangler.jsonc` del subproyecto

Si el subproyecto del demo tiene `wrangler.jsonc`, las claves válidas para Pages son:

```jsonc
{
  "name": "<demo-slug>",
  "compatibility_date": "YYYY-MM-DD",
  "compatibility_flags": ["nodejs_compat"],
  "pages_build_output_dir": "dist"
}
```

**Claves NO soportadas en Pages** (solo Workers): `observability`, `assets`, `vars` (usar dashboard en su lugar), bindings de Workers (KV/R2/D1/Queues — Pages tiene sus propias bindings).

## Deploy manual desde CLI

Si el Pages project no tiene Git integration configurada:

```sh
# desde el repo del demo
pnpm build
wrangler pages deploy dist --project-name=<demo-slug>
```

## Debugging 404

Si `/demos/<demo>/` devuelve 404 desde `juanoliver.net`:

1. **El Worker está corriendo código viejo?** Ver `https://juanoliver.net/demos/<otro-demo>/` — si también 404, el Worker no está actualizado. Forzar redeploy del sitio principal (push vacío o retry del último deploy en el dashboard).
2. **El fix está mergeado a `main`?** El catch-all vive en `src/pages/demos/[...name].astro`. Si ese archivo no tiene el `<demo>` en `DEMO_URLS`, devuelve 302 → `/404`.
3. **El Pages project del demo responde?** `curl -I https://<demo>.pages.dev/`. Si 404, el problema es del subproyecto (build, output dir, adapter), no del catch-all.

## Historial

- **4.4.0** (`a79893e`): migración inicial — cada demo se mueve a su propio Pages project.
- **4.4.1** (`da1dc66`): se registra `galaxynews` en `DEMO_URLS` cuando se deployó su Pages project.
- **PR #70** (`342e347`): merge del catch-all a `main` (incluye `d80ffa6`).