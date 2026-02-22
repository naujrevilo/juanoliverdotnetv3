# juanoliver-web

[![CI/CD Pipeline](https://github.com/juanoliver/juanoliver-web/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/juanoliver/juanoliver-web/actions/workflows/ci-cd.yml)
[![Dependency Review](https://github.com/juanoliver/juanoliver-web/actions/workflows/dependency-review.yml/badge.svg)](https://github.com/juanoliver/juanoliver-web/actions/workflows/dependency-review.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Astro](https://img.shields.io/badge/Astro-5.16-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Azure Static Web Apps](https://img.shields.io/badge/Azure-Static_Web_Apps-0078D4?logo=microsoft-azure&logoColor=white)](https://azure.microsoft.com/services/app-service/static/)
[![Netlify](https://img.shields.io/badge/Netlify-Ready-00C7B7?logo=netlify&logoColor=white)](https://netlify.com)

Sitio web profesional de Juan Oliver, desarrollado con Astro 5, Svelte 5 y Tailwind CSS v4.
Optimizado para Azure Static Web Apps y Netlify con soporte híbrido (SSR).

Versión actual: **3.4.1**

## 🚀 Stack Tecnológico

- **Framework**: Astro 5.16+
- **UI Library**: Svelte 5 (Runes)
- **Estilos**: Tailwind CSS v4
- **Base de Datos**: Turso (LibSQL) + Drizzle ORM
- **Documentación**: Astro Starlight
- **Despliegue**: Azure Static Web Apps / Netlify (Hybrid Mode)
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
- pnpm 10.24.0+
- Cuenta de Turso (para base de datos)
- Azure Static Web Apps o Netlify (para despliegue)

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
pnpm netlify:sync-env  # Sincronizar .env a Netlify
pnpm social:sync-secrets # Sincronizar .env a GitHub Secrets
```

## 🌐 Despliegue

### Azure Static Web Apps

Este proyecto está configurado para **Azure Static Web Apps** en modo Híbrido.

1. Crear un Azure Static Web App
2. Configurar las siguientes variables de entorno:
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`

3. El archivo `staticwebapp.config.json` maneja:
   - Cabeceras de seguridad (CSP, HSTS, etc.)
   - Reglas de enrutamiento
   - Configuración de MIME types
   - Página 404 personalizada

### Netlify

El proyecto también soporta despliegue en Netlify:

1. Conectar el repositorio a Netlify
2. Configurar las variables de entorno en Netlify Dashboard
3. El archivo `netlify.toml` contiene la configuración de build

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
