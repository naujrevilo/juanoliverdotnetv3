# Documentación Interna del Proyecto

Esta carpeta contiene documentación técnica privada sobre la arquitectura, automatización y mantenimiento del proyecto `juanoliverdotnetv3`.

## Índice de Documentación

### 🏗️ Arquitectura y Diseño

- [**Arquitectura del Proyecto**](./PROJECT_ARCHITECTURE.md): Visión general del sistema, diagramas C4, flujos de datos y esquema de base de datos.
- [**Guía de Imágenes**](./IMAGE_GUIDELINES.md): Estándares para formatos de imagen (WebP vs SVG) y resolución de problemas comunes.

### 🤖 Automatización y CI/CD

- [**Flujo de Publicación Social**](./SOCIAL_PUBLISH_WORKFLOW.md): Detalle del pipeline de GitHub Actions para publicar automáticamente en redes sociales.
- [**Guía para subir cambios a GitHub**](./GITHUB_PUSH_WORKFLOW.md): Checklist operativo para validar, commitear y hacer push sin romper CI/CD ni disparar automatizaciones por accidente.
- [**Sincronización de Secretos GitHub**](./SYNC_GITHUB_SECRETS.md): Guía para usar el script `sync-github-secrets.ps1`.
- [**Sincronización de Entorno Netlify**](./SYNC_NETLIFY_ENV.md): Guía para usar el script `sync-env-to-netlify.ts`.

## Estructura de Directorios Relacionada

- `src/scripts/`: Scripts TypeScript de automatización.
- `scripts/`: Scripts PowerShell/Shell de utilidad.
- `.github/workflows/`: Definiciones de CI/CD.
