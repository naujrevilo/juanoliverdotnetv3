---
title: "myNewspaper (The Signal)"
description: "Periódico digital demo construido con Astro 7, Svelte 5 y Tailwind CSS 4, con pipeline de noticias automatizado y despliegue en Cloudflare"
longDescription: "Proyecto demo de un periódico digital completo que demuestra la arquitectura Islands de Astro con solo 4 componentes Svelte interactivos. Incluye un pipeline automatizado para importar noticias desde NewsAPI/NewsData.io, curación de contenido para audiencia colombiana (ES-CO), búsqueda client-side con normalización de acentos, dark mode, view transitions, y un sistema de categorías editoriales con 18 secciones. Desplegado como Worker en Cloudflare con assets estáticos."
publishDate: 2026-07-20
technologies:
  - Astro 7
  - Svelte 5
  - Tailwind CSS 4
  - TypeScript
  - Cloudflare Workers
  - Python
  - NewsData.io API
  - Content Collections
  - View Transitions
  - Islands Architecture
category: "sitio-web"
status: "público"
repoUrl: "https://github.com/naujrevilo/myNewspaper"
demoUrl: "https://juanoliver.net/demos/newspaper/"
image: "/projects/mynewspaper.svg"
featured: true
---

## Descripción del Proyecto

**The Signal** es un periódico digital demo que muestra cómo construir un sitio de noticias moderno con Astro 7 y la arquitectura Islands. El proyecto incluye un pipeline completo de contenido: desde la importación automática de noticias hasta la curación editorial para audiencia colombiana.

### Características Principales

- **Islands Architecture**: Solo 4 componentes Svelte se hidratan en el cliente (ThemeToggle, MobileNav, SearchIsland, ReadingProgress)
- **Pipeline de noticias**: Scripts Python para importar desde NewsAPI/NewsData.io y curar contenido ES-CO
- **Búsqueda avanzada**: Normalización de acentos, búsqueda ponderada (título > tags > descripción)
- **Dark mode**: Persistente con localStorage, sin flash durante view transitions
- **View Transitions**: Navegación SPA con animaciones fade
- **Server Islands**: Indicadores económicos con `server:defer` (Alpha Vantage API)
- **18 categorías editoriales**: Colores temáticos, badges, navegación por secciones
- **RSS feed**: Generado automáticamente con `@astrojs/rss`
- **Página 404**: Diseño editorial consistente
- **Responsive**: Mobile-first con navegación táctil optimizada

### Stack Tecnológico

- **Astro 7.1**: Framework con enrutamiento file-based y Content Collections
- **Svelte 5 (Runes)**: Componentes interactivos con `$state`, `$effect`, `$derived`
- **Tailwind CSS 4**: Utility-first con `@theme` directive y CSS-first config
- **TypeScript**: Tipado estricto para schemas y utilidades
- **Cloudflare Workers**: Despliegue con assets estáticos y path rewriting
- **Python**: Scripts de importación (`import_newsapi.py`, `curate_es_co.py`)
- **NewsData.io API**: Fuente de noticias en español

### Arquitectura

```text
src/
├── components/
│   ├── BaseHead.astro          # SEO, OG, favicons, theme script
│   ├── layout/
│   │   ├── Masthead.astro      # Banner editorial con wordmark
│   │   ├── StickyHeader.astro  # Header fijo con utilidades
│   │   ├── CategoryNav.astro   # Navegación de categorías
│   │   └── Footer.astro        # Footer minimalista
│   ├── editorial/
│   │   ├── Teaser.astro        # Card de artículo (lg/md/sm)
│   │   ├── BreakingTicker.astro # Ticker CSS-only
│   │   ├── SectionHeader.astro # Encabezado de sección
│   │   ├── NewsletterCTA.astro # CTA de suscripción
│   │   ├── EditorialMeta.astro # Fecha, autor, categoría
│   │   ├── AuthorBox.astro     # Bio del autor
│   │   ├── AdSlot.astro        # Placeholder de publicidad
│   │   └── IndicatorsStrip.astro # Indicadores económicos
│   ├── islands/
│   │   ├── ThemeToggle.svelte  # Toggle dark/light mode
│   │   ├── MobileNav.svelte    # Navegación móvil overlay
│   │   ├── SearchIsland.svelte # Búsqueda client-side
│   │   └── ReadingProgress.svelte # Barra de progreso
│   └── ui/
│       └── CategoryBadge.astro # Badge de categoría
├── config/
│   └── site.ts                 # Configuración centralizada
├── content/
│   ├── articles/               # 190+ artículos MDX
│   ├── authors/                # 4 perfiles de autor
│   └── categories/             # 18 categorías JSON
├── layouts/
│   └── BaseLayout.astro        # Shell: Masthead + Header + Footer
├── pages/
│   ├── index.astro             # Portada
│   ├── articles/[slug].astro   # Artículo individual
│   ├── [category]/index.astro  # Página de categoría
│   ├── search.astro            # Búsqueda
│   ├── 404.astro               # Página de error
│   ├── rss.xml.ts              # Feed RSS
│   └── search-index.json.ts    # Índice de búsqueda JSON
├── styles/
│   ├── global.css              # Imports Tailwind + @theme
│   ├── tokens.css              # Tokens de color, reset
│   ├── typography.css          # Tipografía editorial
│   ├── dark-mode.css           # Overrides de tema oscuro
│   └── animations.css          # Animaciones y transiciones
└── utils/
    ├── colors.ts               # Paleta de categorías
    ├── url.ts                  # Helpers de URL con base path
    ├── readingTime.ts          # Calculadora de tiempo de lectura
    └── indicators.ts           # API Alpha Vantage
```

### Pipeline de Contenido

El proyecto incluye un pipeline automatizado para importar y curar noticias:

```bash
# 1. Importar noticias desde NewsData.io
pnpm news:import

# 2. Curar contenido para Colombia (ES-CO)
pnpm news:curate

# 3. O todo junto
pnpm news:update

# 4. Build y deploy
pnpm build
```

**Scripts Python:**
- `import_newsapi.py`: Importa artículos de NewsAPI o NewsData.io
- `curate_es_co.py`: Elimina no-español, reclasifica, genera semillas locales

### Categorías Editoriales

| Categoría | Slug | Color | Descripción |
|-----------|------|-------|-------------|
| Mundo | `world` | #0e6b4a | Noticias internacionales |
| Política | `politics` | #1a4db5 | Gobierno y democracia |
| Economía | `economy` | #b45309 | Finanzas y mercados |
| Ciencia | `science` | #0e7490 | Investigación y descubrimientos |
| Tecnología | `technology` | #5b21b6 | Innovación digital |
| Cultura | `culture` | #9d174d | Arte, cine, música |
| Opinión | `opinion` | #c0191b | Columnas y editoriales |
| Entrevistas | `interviews` | #3f6b5f | Conversaciones con figuras clave |
| Investigaciones | `investigations` | #6d28d9 | Reportajes en profundidad |
| Caribe | `caribe` | #0d9488 | Región Caribe colombiana |
| Pacífico | `pacifico` | #2563eb | Región Pacífico colombiana |
| Regional | `regional` | #15803d | Zona metropolitana |
| Regiones | `regiones` | #b45309 | Macroregiones de Colombia |
| Local | `local` | #0369a1 | Noticias locales |
| Sociales | `sociales` | #7c3aed | Eventos y sociedad |
| Deportes | `deportes` | #198754 | Cobertura deportiva |
| Judicial | `judicial` | #b91c1c | Sistema de justicia |
| Farándula | `farandula` | #db2777 | Entretenimiento y celebridades |

### Componentes Interactivos (Islands)

Solo 4 componentes Svelte se hidratan en el cliente:

**ThemeToggle.svelte** — Toggle dark/light mode con persistencia localStorage. Usa Svelte 5 runes (`$state`, `$effect`).

**MobileNav.svelte** — Navegación móvil full-screen con focus trap, portal pattern para escapar `backdrop-filter`, y animaciones staggered.

**SearchIsland.svelte** — Búsqueda client-side con:
- Normalización de acentos (`á` → `a`, `ñ` → `n`)
- Búsqueda ponderada: título (3x) > tags (2x) > descripción (1x)
- Debounce de 250ms
- Carga del índice JSON en mount

**ReadingProgress.svelte** — Barra de progreso fixed en el viewport que sigue el scroll del artículo.

### Configuración Centralizada

`src/config/site.ts` contiene toda la configuración del sitio:

```typescript
export const siteConfig = {
  name: "The Signal",
  tagline: "Periodismo digital · Demos",
  url: "https://juanoliver.net",
  basePath: "/demos/newspaper",
  social: { youtube: "...", instagram: "...", facebook: "...", x: "..." },
};

export const macroRegions = [
  { id: "andina", name: "Andina", color: "#b45309" },
  { id: "caribe-region", name: "Caribe", color: "#0d9488" },
  // ...
];
```

### Dark Mode

Implementación en tres capas:

1. **CSS** (`dark-mode.css`): Variables CSS con `[data-theme="dark"]` selector
2. **Cliente** (`ThemeToggle.svelte`): Persistencia en localStorage
3. **SPA Guard** (`BaseHead.astro`): Restauración en `astro:before-swap`

### Búsqueda

La búsqueda funciona completamente en el cliente:

1. `search-index.json.ts` genera un JSON con todos los artículos en build time
2. `SearchIsland.svelte` carga el índice en `onMount`
3. Filtra por título, descripción, categoría y tags
4. Muestra resultados ordenados por relevancia

### Deploy en Cloudflare

El proyecto se despliega como Worker con assets estáticos:

```json
// wrangler.jsonc
{
  "name": "newspaper",
  "assets": {
    "directory": "dist/client/demos/newspaper",
    "binding": "ASSETS"
  }
}
```

El Worker reescribe el path para servir el demo en `juanoliver.net/demos/newspaper/`.

### Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Servidor de desarrollo |
| `pnpm build` | Build para producción |
| `pnpm news:dry` | Simula importación sin escribir |
| `pnpm news:import` | Importa noticias desde API |
| `pnpm news:curate` | Curación ES-CO |
| `pnpm news:update` | Importar + curar (todo en uno) |
| `pnpm news:reset` | Purgar y reimportar |
| `pnpm cf:deploy` | Deploy a Cloudflare Workers |

### Performance

- **Islands Architecture**: Solo 4 componentes con JS en cliente
- **CSS-first**: Ticker, animaciones y transiciones sin JS
- **Lazy loading**: Imágenes e islas con `client:idle`
- **Búsqueda client-side**: Sin dependencia de servicios externos
- **Assets estáticos**: Cacheados por Cloudflare CDN

### Versión Actual

✅ **v1.0.0** — Demo funcional con pipeline de noticias automatizado

### Licencia

MIT

---

**Nota**: Este proyecto demuestra cómo construir un periódico digital completo con Astro, aprovechando la arquitectura Islands para minimizar el JavaScript en cliente y un pipeline Python para la gestión de contenido.
