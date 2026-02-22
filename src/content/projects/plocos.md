---
title: "Plocos"
description: "Archivo digital bilingüe (ES/EN) con Astro 5 + TinaCMS para arte, filosofía y narrativas culturales"
longDescription: "Sitio estático moderno que preserva el archivo histórico de plocos.com usando Astro 5, Tailwind CSS 3 y TinaCMS 2. Incluye sistema de comentarios con moderación, búsqueda con Algolia, internacionalización completa y flujo editorial local sin dependencias externas."
publishDate: 2025-11-01
technologies:
  - Astro
  - React
  - Vue
  - TinaCMS
  - Tailwind CSS
  - Turso
  - Drizzle ORM
  - TypeScript
  - Algolia
category: "cms-blog"
status: "público"
demoUrl: "https://plocos.netlify.app"
repoUrl: "https://github.com/naujrevilo/plocos_astro"
image: "/projects/plocos.svg"
featured: true
---

## Descripción del Proyecto

**Plocos** es un archivo digital cultural que combina arte, filosofía y narrativas caribeñas en una experiencia de lectura reflexiva y contemplativa. El proyecto migra el histórico blog de Blogger a una plataforma moderna con Astro 5, preservando todo el contenido original mientras agrega funcionalidades actuales.

### Características Principales

- **Bilingüe (ES/EN)**: Sistema completo de internacionalización con rutas localizadas
- **TinaCMS Local**: Panel editorial visual sin backend remoto requerido
- **Sistema de Comentarios**: Moderación con base de datos Turso (libSQL)
- **Búsqueda Avanzada**: Integración con Algolia para búsqueda instantánea
- **Content Collections**: Gestión tipada de posts, categorías y autores
- **Temas Adaptativos**: Soporte para modo claro, oscuro y sistema
- **SEO Optimizado**: Meta tags, Open Graph, JSON-LD structured data
- **RSS Feeds**: Suscripción a actualizaciones del blog

### Stack Tecnológico

**Frontend**:

- **Astro 5.16**: Framework estático SSR con islands architecture
- **Svelte 5**: Componentes interactivos con Runes API
- **Tailwind CSS 4**: Sistema de diseño custom con tokens CSS
- **TypeScript**: Tipado estricto en todo el proyecto

**CMS & Data**:

- **TinaCMS 2**: Editor visual local con GraphQL API
- **Content Collections**: Validación con Zod schemas

**Base de Datos**:

- **Turso (libSQL)**: Base de datos edge para comentarios
- **Drizzle ORM**: Type-safe database queries

**Servicios**:

- **Algolia**: Búsqueda full-text instantánea
- **Netlify**: Hosting y deploy continuo
- **Google Analytics**: Métricas opcionales

### Arquitectura

```
src/
├── components/        # Componentes Astro y Svelte
│   ├── SiteHeader.astro
│   ├── PostCard.astro
│   └── Search.vue     # Búsqueda con Algolia
├── content/           # Markdown con frontmatter
│   ├── posts/         # Artículos del blog
│   ├── categories/    # Metadatos de categorías
│   └── config.ts      # Schemas Zod
├── layouts/
│   └── BaseLayout.astro
├── lib/
│   ├── i18n.ts        # Traducciones
│   ├── routes.ts      # Helpers de rutas
│   └── db/            # Schemas Drizzle
├── pages/
│   ├── index.astro    # Home bilingüe
│   ├── blog/          # Lista y detalle de posts
│   ├── en/            # Páginas en inglés
│   └── api/           # Endpoints (comentarios)
└── styles/
    └── tailwind.css   # Tokens y utilidades
```

### Sistema de Internacionalización

Astro i18n configurado con:

- **Locales**: `es` (default), `en`
- **Routing**: Rewrites con fallback a español
- **Traducciones**: Objeto centralizado en `lib/i18n.ts`
- **Helper**: `createLocaleHref()` para enlaces consistentes

Ejemplo de estructura de rutas:

```
/                      → Español (default)
/blog                  → Lista en español
/en                    → Inglés
/en/blog               → Lista en inglés
/posts/mi-articulo     → Detalle multilingüe
```

### Sistema de Comentarios

Implementación desde cero con moderación:

1. **Frontend**: Formulario accesible en `CommentSection.astro`
2. **API**: Endpoint `/api/comments` con validación
3. **Base de Datos**: Tabla `Comments` en Turso
4. **Moderación**: Panel `/admin/comments` con autenticación
5. **Seguridad**: Sanitización de inputs, rate limiting

Solo comentarios aprobados (`approved = 1`) se muestran públicamente.

### Migración desde Blogger

Scripts personalizados en `scripts/`:

- **import-plocos.js**: Importa XML de Blogger
- **flatten-posts.mjs**: Normaliza estructura de carpetas
- **algolia-sync.mjs**: Sincroniza posts con Algolia

Preserva:

- URLs originales (metadato `originalUrl`)
- Fechas de publicación y actualización
- Imágenes (copiadas sin duplicados)
- Categorías y etiquetas

### TinaCMS Setup

Configuración en `tina/config.ts`:

**Colecciones editables**:

- Posts: frontmatter completo + body Markdown
- Categorías: metadatos y descripciones
- Autores: biografías y avatares

**Desarrollo local**:

```bash
pnpm tinacms:dev
# Acceder a http://localhost:4321/admin/index.html
```

No requiere Tina Cloud para funcionar localmente.

### Despliegue

**Netlify + GitHub Actions**:

1. Push a `main` trigger build automático
2. Build con `pnpm build` (output SSR a Netlify Functions)
3. Variables de entorno:
   - `ASTRO_DB_REMOTE_URL`: Turso database URL
   - `ASTRO_DB_APP_TOKEN`: Auth token de Turso
   - `ALGOLIA_APP_ID` + `ALGOLIA_ADMIN_API_KEY`
   - `ANALYTICS_ID`: Google Analytics (opcional)

### Tipografía y Diseño

**Fuentes**:

- **Sans**: Noto Sans (cuerpo)
- **Heading**: Sarala (títulos)
- **Serif** y **Mono**: System fonts

**Paleta de colores**:

Tokens CSS con soporte para temas:

```css
--surface-base
--surface-elevated
--text-primary
--text-secondary
--accent (primario)
--border-subtle
```

### Funcionalidades Destacadas

**Búsqueda**:

- Componente Vue con InstantSearch
- Búsqueda en título, descripción, contenido
- Facetas por categoría y autor

**Compartir**:

- Botones sociales (X, Facebook, Instagram)
- WhatsApp share con mensaje personalizado

**Paginación**:

- 12 posts por página
- Aria labels accesibles

**Contacto**:

- Formulario Netlify Forms
- Integración PayPal para donaciones

### Performance

- **Lighthouse**: 90+ en todas las métricas
- **View Transitions**: Navegación suave con Astro
- **Lazy Loading**: Imágenes y componentes diferidos
- **Prerendering**: Páginas estáticas cuando es posible

### Mantenimiento

**Scripts útiles**:

```bash
# Desarrollar con Tina
pnpm tinacms:dev

# Sincronizar búsqueda
pnpm algolia:sync

# Push schema DB
pnpm astro db push -- --remote

# Aplana posts nested
pnpm flatten-posts
```

### Versión Actual

✅ **v0.1.35** - Producción estable

### Próximos Pasos

- Migrar a Astro DB Studio cuando esté disponible
- Añadir más idiomas (francés, catalán)
- Newsletter con servicio externo
- Modo de lectura offline (PWA)

### Licencia

Contenido: © Plocos  
Código: MIT

---

**Nota**: Este proyecto demuestra arquitectura Astro avanzada con SSR, i18n completo, CMS headless y gestión de base de datos edge.
