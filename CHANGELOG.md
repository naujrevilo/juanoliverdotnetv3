# [3.0.1] - 2026-01-16

### Changed

- Integración SSR de fecha de última modificación real (`lastModified`) en:
  - Aviso de Privacidad (`/privacidad`)
  - Términos de Servicio (`/terminos`)
  - Documentación de Ethical Hacking (`/docs/ethical-hacking`)
- Uso de endpoint API y git para obtener la fecha real de modificación.
- Código documentado y comentado para facilitar extensión a otros documentos.

# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

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
