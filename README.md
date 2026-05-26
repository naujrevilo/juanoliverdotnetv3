# juanoliver-web

[![CI/CD Pipeline](https://github.com/juanoliver/juanoliver-web/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/juanoliver/juanoliver-web/actions/workflows/ci-cd.yml)
[![Dependency Review](https://github.com/juanoliver/juanoliver-web/actions/workflows/dependency-review.yml/badge.svg)](https://github.com/juanoliver/juanoliver-web/actions/workflows/dependency-review.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Astro](https://img.shields.io/badge/Astro-5.16-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-F38020?logo=cloudflare&logoColor=white)](https://pages.cloudflare.com)

Sitio web profesional de Juan Oliver, desarrollado con Astro 5, Svelte 5 y Tailwind CSS v4.
Desplegado en **Cloudflare Pages** con SSR via `@astrojs/cloudflare`.

Versión actual: **4.0.0**

## 🚀 Stack Tecnológico

- **Framework**: Astro 5.16+
- **UI Library**: Svelte 5 (Runes)
- **Estilos**: Tailwind CSS v4
- **Base de Datos**: Turso (LibSQL) + Drizzle ORM
- **Documentación**: Astro Starlight
- **Despliegue**: Cloudflare Pages (`@astrojs/cloudflare`)
- **CI/CD**: GitHub Actions
- **Seguridad**: Snyk, CSP Headers, HSTS

### Catálogo de Servicios y Tienda

- `/servicios`: catálogo detallado de servicios profesionales, renderizado con SSR e hidratado en cliente para mejor SEO y rendimiento.
- `/tienda`: muestra exclusivamente productos y servicios locales; la integración con el catálogo externo de SYSCOM está implementada pero deshabilitada en producción.

### Portafolio de Proyectos

- `/proyectos`: portafolio interactivo con filtros por categoría y tecnología.
- `src/content/projects`: colección de proyectos con metadata tipada y páginas dedicadas.

## 📋 Prerrequisitos

- Node.js >= 22.21.1 (LTS recomendado, evitar v24+)
- pnpm 9.15.4
- Cuenta de Turso (para base de datos)
- Cuenta de Cloudflare (para despliegue)
- Cuenta de Resend (para formulario de contacto)

## 🛠️ Configuración Local

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/juanoliver/juanoliver-web.git
   cd juanoliver-web
   ```

2. **Instalar dependencias**

   ```bash
   pnpm install
   ```

3. **Configurar variables de entorno**

   Copiar `.env.example` a `.env` y rellenar los datos de Turso:

   ```bash
   cp .env.example .env
   ```

   Variables requeridas:

   ```env
   TURSO_DATABASE_URL="libsql://..."
   TURSO_AUTH_TOKEN="..."
   ```

   Variables opcionales (requeridas en producción):

   ```env
   RESEND_API_KEY="re_..."        # Formulario de contacto (Resend)
   BOLD_SECRET_KEY="..."          # Pagos Bold
   BOLD_IDENTITY_KEY="..."        # Pagos Bold
   COMMENTS_MODERATION_TOKEN="..." # Moderación de comentarios
   ```

4. **Generar migraciones de base de datos**

   ```bash
   pnpm db:generate
   ```

   Si tienes acceso a la BD, puedes sincronizar:

   ```bash
   pnpm db:push
   ```

5. **Iniciar servidor de desarrollo**

   ```bash
   pnpm dev
   ```

   El sitio estará disponible en `http://localhost:4321`

## 📦 Scripts Disponibles

```bash
pnpm dev          # Servidor de desarrollo
pnpm build        # Compilar para producción
pnpm preview      # Vista previa de la build
pnpm check        # Validación de tipos TypeScript
pnpm db:generate  # Generar migraciones de Drizzle
pnpm db:push      # Aplicar cambios directamente a BD
pnpm db:studio    # Abrir Drizzle Studio (GUI)
pnpm db:seed      # Poblar BD con datos de ejemplo
pnpm social:sync-secrets # Sincronizar .env a GitHub Secrets
```

## 🌐 Despliegue

### Cloudflare Pages

El proyecto usa `@astrojs/cloudflare` como adapter con output `server`.

1. Conectar el repositorio a Cloudflare Pages
2. Configurar las variables de entorno en el **Cloudflare Pages dashboard**:
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
   - `RESEND_API_KEY`
   - `COMMENTS_MODERATION_TOKEN`
   - `BOLD_SECRET_KEY`
   - `BOLD_IDENTITY_KEY`
3. Build command: `pnpm build`
4. Output directory: `dist`

> **Nota**: `wrangler.toml` incluye `nodejs_compat = true` — requerido por `@libsql/client`.

### GitHub Actions

El workflow CI/CD se ejecuta automáticamente:

- **En Pull Requests**: Deploy a entorno de preview
- **En Push a `main`**: Deploy a producción
- **Checks de calidad**: TypeScript, build, Snyk security scan

## 🔒 Seguridad

- **Content Security Policy (CSP)**: Configurado en `staticwebapp.config.json`
- **HSTS**: Strict-Transport-Security con preload
- **Dependency Scanning**: Snyk + GitHub Dependency Review
- **Input Validation**: Uso estricto de Zod para validación
- **Environment Variables**: Nunca commitear archivos `.env`

### Security Headers Configurados

```json
{
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "Content-Security-Policy": "...",
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "X-XSS-Protection": "1; mode=block"
}
```

## 📁 Estructura del Proyecto

```
juanoliver-web/
├── .github/
│   ├── workflows/          # GitHub Actions CI/CD
│   └── instructions/       # Reglas de Snyk
├── public/
│   └── robots.txt          # SEO
├── src/
│   ├── components/         # Componentes Astro/Svelte
│   ├── content/
│   │   ├── blog/          # Artículos MDX
│   │   └── docs/          # Documentación Starlight
│   ├── db/                # Drizzle ORM schema & client
│   ├── layouts/           # Layouts de Astro
│   ├── pages/             # Rutas del sitio
│   ├── services/          # Lógica de negocio
│   └── styles/            # CSS global
├── astro.config.mjs       # Configuración Astro
├── drizzle.config.ts      # Configuración Drizzle
├── staticwebapp.config.json # Azure SWA config
├── tailwind.config.mjs    # Configuración Tailwind
└── tsconfig.json          # TypeScript config
```

## 🎨 Paleta de Colores

```css
--color-security-blue: #001a5a --color-security-blue-light: #4a72b2
  --color-security-red: #981628 --color-security-yellow: #d19219
  --color-security-gray-bg: #d8d8d8 --color-security-gray-text: #656565;
```

## 📝 Licencia

MIT License - Ver archivo [LICENSE](LICENSE) para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 👨‍💻 Autor

**Juan Oliver**

- Experto en Ciberseguridad
- LinkedIn: [linkedin.com/in/juanoliver](https://linkedin.com/in/juanoliver)
- GitHub: [@juanoliver](https://github.com/juanoliver)
- Website: [juanoliver.net](https://juanoliver.net)

---

&copy; 2025 Juan Oliver. Todos los derechos reservados.
