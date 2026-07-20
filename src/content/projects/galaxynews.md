---
title: "Galaxy News"
description: "Portal de noticias profesional para periodista independiente, construido con Astro 4, Tailwind CSS 3 y MDX"
longDescription: "Sitio web de noticias desarrollado con Astro para un periodista independiente que migra de WhatsApp a una plataforma web profesional. Incluye 14 categorías editoriales, 8 componentes reutilizables, sistema de autores, RSS feed, y espacios publicitarios configurables. Diseñado para ser rápido, SEO-friendly y fácil de mantener."
publishDate: 2024-12-01
technologies:
  - Astro 4
  - Tailwind CSS 3
  - MDX
  - TypeScript
  - date-fns
  - Content Collections
  - "@astrojs/rss"
category: "sitio-web"
status: "público"
repoUrl: "https://github.com/naujrevilo/galaxynews"
demoUrl: "https://juanoliver.net/demos/galaxynews/"
image: "/projects/galaxynews.svg"
featured: false
---

## Descripción del Proyecto

**Galaxy News** es un portal de noticias digital diseñado para un periodista independiente que quiere migrar su audiencia de WhatsApp a una plataforma web profesional. El proyecto demuestra cómo construir un sitio de noticias completo con Astro, aprovechando Content Collections para la gestión de contenido y Tailwind CSS para el diseño.

### Características Principales

- **8 componentes reutilizables**: Header, Footer, HeroArticle, ArticleCard, BreakingNewsTicker, AdSlot, Newsletter, ShareButtons
- **14 categorías editoriales**: opinión, Colombia, internacional, política, economía, deportes, cultura, tecnología, salud, justicia, entretenimiento, especiales, galería, última hora
- **Content Collections**: Artículos y autores con validación Zod
- **Ticker de última hora**: Noticias breaking con animación CSS
- **Espacios publicitarios**: Configurables (header, sidebar, in-article, footer)
- **Newsletter**: Formulario de suscripción integrado
- **ShareButtons**: Compartir en redes sociales
- **RSS feed**: Generado automáticamente con @astrojs/rss
- **SEO optimizado**: Meta tags por página y artículo
- **Diseño responsive**: Mobile-first con Tailwind CSS

### Stack Tecnológico

- **Astro 4.5+**: Framework estático con enrutamiento file-based
- **Tailwind CSS 3.4**: Utility-first styling
- **@tailwindcss/typography**: Plugin para prosa de artículos
- **date-fns**: Librería de fechas con locale español
- **MDX**: Markdown extendido con componentes
- **TypeScript**: Tipado estricto para schemas
- **@astrojs/rss**: Generación de feed RSS

### Arquitectura

```text
src/
├── components/
│   ├── AdSlot.astro           # Espacios publicitarios configurables
│   ├── ArticleCard.astro      # Tarjeta de artículo (grid)
│   ├── BreakingNewsTicker.astro # Ticker de última hora (CSS animation)
│   ├── Footer.astro           # Pie de página con links y redes
│   ├── Header.astro           # Cabecera con navegación y categorías
│   ├── HeroArticle.astro      # Artículo destacado (hero section)
│   ├── Newsletter.astro       # Formulario de suscripción
│   └── ShareButtons.astro     # Botones para compartir
├── content/
│   ├── articles/              # 7 artículos MDX de ejemplo
│   └── config.ts              # Schema Zod (articles + authors)
├── layouts/
│   └── BaseLayout.astro       # Layout base con SEO
└── pages/
    ├── index.astro            # Homepage con hero, ticker, grid
    ├── articulos/
    │   └── [...slug].astro    # Detalle de artículo
    ├── categoria/
    │   └── [category].astro   # Filtro por categoría
    ├── contacto.astro         # Formulario de contacto
    ├── sobre-nosotros.astro   # Quién soy / Misión
    └── publicidad.astro       # Información para anunciantes
```

### Categorías Editoriales

| Categoría | Slug | Descripción |
|-----------|------|-------------|
| Opinión | `opinion` | Columnas y editoriales |
| Colombia | `colombia` | Noticias nacionales |
| Internacional | `internacional` | Noticias del mundo |
| Política | `politica` | Gobierno y elecciones |
| Economía | `economia` | Finanzas y negocios |
| Deportes | `deportes` | Eventos deportivos |
| Cultura | `cultura` | Arte y cultura |
| Tecnología | `tecnologia` | Innovación digital |
| Salud | `salud` | Bienestar y salud |
| Justicia | `justicia` | Sistema judicial |
| Entretenimiento | `entretenimiento` | Espectáculos |
| Especiales | `especiales` | Reportajes en profundidad |
| Galería | `galeria` | Fotografía |
| Última Hora | `ultima-hora` | Noticias urgentes |

### Schema de Artículos

```typescript
const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    author: z.string(),
    authorBio: z.string().optional(),
    authorPhoto: z.string().optional(),
    category: z.enum([
      'opinion', 'colombia', 'internacional', 'politica',
      'economia', 'deportes', 'cultura', 'tecnologia',
      'salud', 'justicia', 'entretenimiento', 'especiales',
      'galeria', 'ultima-hora'
    ]),
    image: z.string().optional(),
    featured: z.boolean().default(false),
    breaking: z.boolean().default(false),
    tags: z.array(z.string()).optional(),
    readingTime: z.number().optional(),
    relatedArticles: z.array(z.string()).optional(),
  }),
});
```

### Componentes

**BreakingNewsTicker.astro** — Ticker animado de última hora con CSS puro (sin JavaScript). Duplica items para loop seamless.

**HeroArticle.astro** — Artículo destacado full-width con imagen, categoría, título, extracto y fecha.

**ArticleCard.astro** — Tarjeta de artículo para grid con imagen, categoría, título, extracto y fecha relativa.

**AdSlot.astro** — Espacios publicitarios en 4 ubicaciones: header (728x90), sidebar (300x250), in-article (728x90), footer (728x90).

**Newsletter.astro** — Formulario de suscripción con email input y botón CTA.

**ShareButtons.astro** — Botones para compartir en WhatsApp, Twitter, Facebook y copiar enlace.

**Header.astro** — Cabecera con logo, navegación principal y barra de categorías con scroll horizontal.

**Footer.astro** — Pie de página con grid de 3 columnas: sobre el sitio, secciones, redes sociales.

### Páginas

**Homepage (`/`)**:
- Hero con noticia destacada
- Ticker de última hora
- Grid de noticias por categoría
- Sidebar con más leídas

**Artículo (`/articulos/[slug]`)**:
- Imagen hero full-width
- Metadata: fecha, categoría, autor, tiempo de lectura
- Contenido MDX renderizado
- Artículos relacionados
- Botones para compartir

**Categoría (`/categoria/[category]`)**:
- Título de categoría
- Grid de artículos filtrados
- Mensaje si no hay contenido

**Contacto (`/contacto`)**:
- Formulario de contacto

**Sobre Nosotros (`/sobre-nosotros`)**:
- Perfil del periodista
- Misión y visión

**Publicidad (`/publicidad`)**:
- Información para anunciantes
- Tarifas y formatos

### Monetización

Espacios publicitarios no invasivos:

| Ubicación | Tamaño | Tipo |
|-----------|--------|------|
| Header | 728x90 | Banner horizontal |
| Sidebar | 300x250 | MPU (2 slots) |
| In-article | 728x90 | Banner |
| Footer | 728x90 | Banner horizontal |

### Build y Deploy

```bash
# Desarrollo
pnpm dev          # localhost:4321

# Producción
pnpm build        # ./dist/
pnpm preview      # Preview local
```

**Output**: Sitio estático 100% con HTML pre-renderizado.

**Deploy**: Compatible con Cloudflare Pages, Vercel, Netlify, GitHub Pages.

### Versión Actual

✅ **v1.0.0** — Portal funcional con 7 artículos de ejemplo

### Licencia

MIT

---

**Nota**: Este proyecto fue desarrollado para un periodista independiente como alternativa profesional a la distribución de noticias por WhatsApp.
