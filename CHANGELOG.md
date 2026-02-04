# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [3.2.34] - 2026-02-04

### Fixed

- **Blog**: Corregido error de visualización en imagen de portada del post "Pruebas de penetración automatizadas". Se reemplazó el archivo `.svg` (que dependía de variables CSS no disponibles) por su versión rasterizada `.webp`.
- **Versionado**: Sincronización de versión en `package.json`.

### Added

- **Documentación**: Nueva guía interna `docs/internal/IMAGE_GUIDELINES.md` sobre el uso correcto de formatos de imagen y limitaciones de SVG.

## [3.2.33] - 2026-02-04

### Added

- **Automatización**:
  - Implementado script `src/scripts/sync-env-to-netlify.ts` para sincronizar variables de entorno locales (`.env`) a Netlify.
  - Implementado script `scripts/sync-github-secrets.ps1` para sincronizar variables de entorno a GitHub Secrets.
  - Añadidos comandos `pnpm netlify:sync-env` y `pnpm social:sync-secrets`.
- **Documentación Interna**:
  - Creada estructura `docs/internal/` para documentación técnica de scripts y workflows.
  - Añadidas guías: `SOCIAL_PUBLISH_WORKFLOW.md`, `SYNC_GITHUB_SECRETS.md`, `SYNC_NETLIFY_ENV.md`.

### Changed

- **Organización del Proyecto**:
  - Movidos archivos `.md` de documentación técnica (AGENT, ARCHITECTURE, etc.) desde la raíz a la carpeta `docs/`.
  - Actualizado `.gitignore` para proteger scripts de sincronización (`src/scripts/sync-env-to-netlify.ts`, `scripts/sync-github-secrets.ps1`).
- **Configuración**:
  - Corregida ausencia de `PUBLIC_SITE_URL` en `.env`.
  - Actualizado `package.json` con nuevos scripts de mantenimiento.

## [3.2.28] - 2026-02-03

### Fixed

- **Formulario de Contacto**:
  - Solucionado problema de notificaciones por correo en Netlify Forms.
  - Implementado campo oculto `subject` con variables dinámicas (`%{formName} (#%{submissionId})`).
  - Renombrado campo `subject` visible a `consulta_tipo` para evitar colisión de nombres.
- **CI/CD**:
  - Actualizado `pnpm-lock.yaml` para resolver error de `frozen-lockfile` en despliegue (desincronización con `package.json`).

## [3.2.26] - 2026-02-03

### Changed

- **Front Matter CMS**:
  - Configuración corregida para usar tipos de campo nativos (`draft`, `datetime`, `choice`).
  - Solucionado problema de valores por defecto (borrador activo, fecha actual).
- **Limpieza del Proyecto**:
  - Eliminadas dependencias no utilizadas del `package.json`: `bcryptjs`, `body-parser`, `cors`, `dotenv`, `express`, `jsonwebtoken`, `mongoose`, `morgan`, `nodemailer`, `stripe`, `zod`.
  - Eliminadas dependencias de desarrollo no utilizadas: `@types/bcryptjs`, `@types/express`, `@types/jsonwebtoken`, `@types/morgan`.
  - Eliminada carpeta `src/content/users` para resolver advertencia de deprecación de Astro sobre colecciones auto-generadas.
- **Versiones**:
  - Dependencias fijadas a versiones exactas (eliminados caret `^` y tilde `~`).
  - Actualizado `@types/node` a v22.13.0 para alinear con entorno de ejecución.

## [3.2.1] - 2026-01-30

### Security

- **Gestión de Estado**: Refactorizado el sistema de estado del sitio (`siteStatus`).
  - Eliminado endpoint inseguro y páginas de gestión de estado.
  - Implementada configuración estática (`src/data/siteStatus.ts`) gestionada vía GitOps para mayor seguridad.

## [3.2.0] - 2026-01-30

### Added

- **Sistema de Borradores (Drafts)**: Implementado soporte para estado `draft: true` en colecciones de contenido (Blog y Docs).
  - El contenido en borrador se oculta automáticamente en producción.
  - Los elementos de UI (botones, menús) relacionados con Docs se ocultan si no hay contenido público.
- **Atomic Commits Protocol**: Definido flujo de trabajo de versionamiento y commits en `docs/WORKFLOW_STANDARDS.md`.

### Changed

- **UI Blog**:
  - Título principal actualizado para usar el color de contraste "Sobre este blog" (visible en light/dark).
  - Tarjetas de artículos (`BlogCard`) ahora son completamente clicables (inset anchor).
  - Eliminado enlace redundante "Leer ahora" en post destacado.
- **UI General**:
  - Solucionado problema de inversión de colores en `/blog` (fondo forzado).
  - Actualizado `.gitignore` para proteger documentación interna (`docs/`) y archivos `.md` en raíz.
  - Eliminados archivos de documentación interna del repositorio público.
- **Infraestructura**:
  - `Header` y `Footer` ahora filtran dinámicamente enlaces a documentación basados en estado `draft`.
  - `HeroSection` oculta botón de documentación si no hay guías publicadas.

## [3.1.2] - 2026-01-18

### Fixed

- **Tienda** (`/tienda`): Eliminado aviso de "Catálogo externo SYSCOM deshabilitado" para limpiar la interfaz en producción.
- **Componentes**: Corregido error de hidratación en `ServicesList.svelte` (uso de `.source`).
- **Prerenderizado**: Solucionado warning de `Astro.request.headers` en páginas estáticas (`blog`, `servicios`) mediante propagación de contexto (`isStatic`) en `Layout` y `Footer`.
- **Blog**:
  - Añadidos botones de compartir en redes: WhatsApp, Mastodon, Bluesky, X (Twitter), LinkedIn, Facebook y Email.
  - Opción de “Guardar en PDF” mejorada para que incluya las imágenes del post al imprimir.

## [3.1.0] - 2026-01-17

### Changed

- Página de Servicios (`/servicios`):
  - `ServicesList.svelte` ahora se hidrata con `client:load` para asegurar renderizado SSR y evitar problemas de carga en cliente.
- Tienda (`/tienda`):
  - Catálogo externo de SYSCOM deshabilitado explícitamente en la capa de servicios; la tienda solo muestra productos y servicios locales.
  - Aviso visible indicando que la integración con SYSCOM está implementada a nivel técnico pero no activa en producción.

### Removed

- Eliminado `src/components/LastModified.jsx` para evitar dependencia innecesaria de React; se mantiene el componente SSR `LastModified.astro`.

## [3.0.1] - 2026-01-16

### Changed

- Integración SSR de fecha de última modificación real (`lastModified`) en:
  - Aviso de Privacidad (`/privacidad`)
  - Términos de Servicio (`/terminos`)
  - Documentación de Ethical Hacking (`/docs/ethical-hacking`)
- Uso de endpoint API y git para obtener la fecha real de modificación.
- Código documentado y comentado para facilitar extensión a otros documentos.

## [3.0.0] - 2026-01-14

### Added

- **Página de Servicios** (`/servicios`): Nueva página con catálogo de servicios profesionales
- **Sistema de Carrito**: Componentes Svelte para gestión de carrito de compras
  - `CartWidget.svelte`: Widget flotante del carrito
  - `CartModal.svelte`: Modal con detalles del carrito
  - `src/stores/cart.ts`: Store de Svelte para estado del carrito
- **ServicesList.svelte**: Componente de lista de servicios con animaciones
- **ServiceCard.astro**: Tarjeta de servicio reutilizable
- **Nuevas páginas de documentación**:
  - Ethical Hacking
  - Seguridad Cloud
  - Servicios de Ciberseguridad
  - Zero Trust
- **Iconos de servicios**: SVGs optimizados para cada servicio
- **API endpoints** (`/api/`): Endpoints para operaciones del servidor
- **Configuración Netlify** (`netlify.toml`): Soporte para despliegue en Netlify
- **Archivo de servicios** (`src/data/services.json`): Catálogo de servicios

### Changed

- **Tienda**: Productos de SYSCOM deshabilitados temporalmente (solo productos locales)
- **Componentes Svelte**: Migrados a `client:only="svelte"` para evitar errores de SSR
- **Configuración Vite**: Añadida exclusión de `.pnpm-store` en watcher
- **Estilos globales**: Mejoras en dark mode y animaciones
- Múltiples mejoras en componentes existentes:
  - BlogCard, CTABox, ContentCard, Footer
  - PageHero, SectionBadge, StatsBar
  - StoreFilters, StoreList, TableOfContents
  - DocsHero, DocsIndexHero, AboutSection
  - CTASection, ServiceCard (home), ServicesSection

### Fixed

- Compatibilidad con Node.js 22 LTS (resueltos problemas con Node.js 24)
- Errores de SSR en componentes Svelte con APIs del navegador
- Timeouts de Vite en desarrollo

### Security

- Actualización de dependencias de seguridad
- Mejoras en configuración de headers

## [Unreleased]

### Added

- Configuración inicial del proyecto con Astro 5
- Integración de Svelte 5 para componentes interactivos
- Tailwind CSS v4 para estilos
- Drizzle ORM + Turso para base de datos
- Astro Starlight para documentación
- Página de inicio con hero section y servicios
- Sistema de blog con MDX
- Tienda de productos
- Página de socios/partners
- Workflows de CI/CD con GitHub Actions
- Security headers en Azure Static Web Apps
- CSP, HSTS, y otros headers de seguridad
- Página 404 personalizada
- Sitemap automático
- Robots.txt optimizado
- Archivos de documentación (CONTRIBUTING.md, SECURITY.md)
- Licencia MIT

### Added (2025-01-04)

- **ARCHITECTURE.md**: Documentación de arquitectura con diagramas Mermaid
- **TESTING.md**: Estrategia de testing con Vitest y Playwright
- **GitHub Templates**:
  - `.github/PULL_REQUEST_TEMPLATE.md`: Template estandarizado para PRs
  - `.github/ISSUE_TEMPLATE/bug_report.md`: Template para reportar bugs
  - `.github/ISSUE_TEMPLATE/feature_request.md`: Template para solicitar features
  - `.github/ISSUE_TEMPLATE/config.yml`: Configuración de issues
  - `.github/CODEOWNERS`: Propietarios de código definidos
  - `.github/dependabot.yml`: Actualizaciones automáticas de dependencias
- **Instrucciones para agentes IA**:
  - `.github/instructions/code_style.instructions.md`: Convenciones de código
  - `.github/instructions/testing.instructions.md`: Guía de testing
- **Comentarios JSDoc** en archivos de código:
  - `src/db/schema.ts`: Documentación de tablas products y partners
  - `src/db/client.ts`: Documentación del cliente Turso/Drizzle
  - `src/content/config.ts`: Documentación de colecciones blog y docs
  - `src/data/navigation.ts`: Documentación de enlaces de navegación
  - `src/data/partners.ts`: Documentación de datos de socios
  - `src/data/social.ts`: Documentación de redes sociales
  - `src/services/products.ts`: Documentación mejorada del servicio de productos

### Fixed (2025-01-04)

- **Router 404 Warning**: Corregido conflicto de rutas entre página 404 personalizada
  y la página 404 de Starlight. Se añadió `disable404Route: true` en la configuración
  de Starlight para deshabilitar la ruta 404 por defecto y usar la página personalizada.

### Security

- Configuración de Content Security Policy (CSP)
- HSTS con preload habilitado
- X-Frame-Options, X-Content-Type-Options
- Permissions-Policy configurado
- Snyk security scanning en CI/CD
- GitHub Dependency Review
- Input validation con Zod

## [0.0.1] - 2025-12-02

### Added

- Versión inicial del proyecto

[3.0.0]: https://github.com/juanoliver/juanoliver-web/compare/v0.0.1...v3.0.0
[Unreleased]: https://github.com/juanoliver/juanoliver-web/compare/v3.0.0...HEAD
[0.0.1]: https://github.com/juanoliver/juanoliver-web/releases/tag/v0.0.1
