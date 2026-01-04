# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

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

[Unreleased]: https://github.com/juanoliver/juanoliver-web/compare/v0.0.1...HEAD
[0.0.1]: https://github.com/juanoliver/juanoliver-web/releases/tag/v0.0.1
