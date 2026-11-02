# Guía interna para subir cambios a GitHub

> **Objetivo:** dejar una referencia corta y confiable para preparar cambios, validarlos y subirlos al repositorio sin romper CI/CD ni disparar automatizaciones por accidente.

## Cuándo usar esta guía

Usá esta guía antes de:

- hacer `push` de cambios a una rama remota;
- abrir un Pull Request;
- subir cambios de contenido en `src/content/blog/**` que puedan activar automatizaciones.

## Prerrequisitos

- **Node.js:** `22.21.1`
- **pnpm:** `9.15.4`
- `pnpm install` ejecutado al menos una vez en la raíz del proyecto
- remoto de Git configurado
- **GitHub CLI (`gh`)** solo si vas a sincronizar secrets o trabajar desde terminal con PRs

## Checklist antes de hacer push

### 1. Revisar qué cambió

Confirmá que el diff incluya solo archivos intencionales:

- código o contenido del cambio;
- documentación relacionada, si aplica;
- `package.json` y `CHANGELOG.md` cuando el cambio implique versionado.

### 2. Validar el proyecto

Validación mínima obligatoria para este repo:

```bash
pnpm check
```

Validación adicional **solo si tu cambio afecta runtime, rutas, contenido tipado, adapters o configuración de build**:

```bash
pnpm build
```

> `pnpm build` también corre en CI. En local conviene reservarlo para cambios que realmente alteran comportamiento de build o SSR.

### 3. Revisar secretos y archivos sensibles

Antes de subir:

- **no** commitear `.env` ni credenciales;
- verificar que no se filtren tokens en documentación, scripts o capturas;
- si necesitás sincronizar variables para workflows, usar la guía de [`SYNC_GITHUB_SECRETS.md`](./SYNC_GITHUB_SECRETS.md).

### 4. Verificar automatizaciones sensibles

#### Si cambiaste `src/content/blog/**`

Un `push` a `main` con cambios en esa carpeta puede disparar el workflow de auto-publicación social.

Antes de subir contenido del blog, confirmá:

- que el slug final sea el correcto;
- que no quede un archivo duplicado por renombre;
- que el frontmatter esté listo (`draft`, `title`, `description`, `socialImage`);
- que querés realmente publicar si el destino es `main`.

> Los renombrados manuales pueden dejar duplicados temporales. Conviene revisar `git status` y validar con `pnpm check` antes del push.

## Flujo recomendado

### Opción A: subir una rama de trabajo

```bash
git status
git add <archivos>
git commit -m "tipo(scope): descripción"
git push origin <tu-rama>
```

Luego abrí un Pull Request hacia la rama base correspondiente.

### Opción B: actualizar una rama ya publicada

```bash
git status
git add <archivos>
git commit -m "tipo(scope): descripción"
git push
```

## Convenciones de commit

Usamos **Conventional Commits**:

```text
tipo(scope): descripción corta
```

Ejemplos válidos:

- `feat(blog): agrega landing de Interstellar Writer`
- `fix(content): elimina slug duplicado del post v1.1.0`
- `docs(workflow): documenta checklist de push a github`
- `chore(version): actualiza sitio a 3.4.10`

## Qué esperar en GitHub

### CI/CD principal

El workflow `ci-cd.yml` corre en:

- `push` a `main`
- `push` a `dev`
- `pull_request` hacia `main`
- `pull_request` hacia `dev`

Checks principales:

- `pnpm install --frozen-lockfile`
- `pnpm astro check`
- `pnpm build`
- escaneo Snyk (no bloqueante)

### Dependency Review

El workflow `dependency-review.yml` corre en Pull Requests hacia:

- `main`
- `develop`

> Esta diferencia con `dev` es **intencional en el estado actual del repo**. No asumir que es un error ni “corregirla” sin revisar impacto.

### Auto-publicación social

El workflow `social-publish.yml` corre en `push` a `main` cuando cambian archivos dentro de `src/content/blog/**`.

Además:

- puede ejecutarse manualmente con `workflow_dispatch`;
- actualiza `.published-posts.json` si detecta publicaciones nuevas;
- ignora borradores y controla duplicados.

## Checklist rápido para PR

Antes de abrir o actualizar un PR:

- [ ] Corrí `pnpm check`
- [ ] Corrí `pnpm build` si el cambio afecta runtime/build
- [ ] Revisé que no haya archivos duplicados por renombre
- [ ] Confirmé que no subo `.env` ni secretos
- [ ] El mensaje de commit sigue Conventional Commits
- [ ] La documentación quedó actualizada si cambié flujo, scripts o variables de entorno

## Archivos relacionados

- `docs/CONTRIBUTING.md` — guía pública de contribución
- `docs/WORKFLOW_STANDARDS.md` — estándares del flujo de trabajo
- `docs/internal/SYNC_GITHUB_SECRETS.md` — sincronización de secretos para GitHub Actions
- `.github/workflows/ci-cd.yml` — pipeline principal
- `.github/workflows/social-publish.yml` — auto-publicación social
- `.github/workflows/dependency-review.yml` — revisión de dependencias en PRs
