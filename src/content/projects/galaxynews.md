---
title: "Galaxy News"
description: "Portal de noticias moderno construido con Astro y Tailwind CSS, con sistema de categorías y artículos en Markdown"
longDescription: "Sitio web de noticias estático desarrollado con Astro que demuestra el patrón de Content Collections para artículos periodísticos. Incluye categorización automática, formato de fechas relativas, diseño responsive y optimización de imágenes con Unsplash."
publishDate: 2024-03-01
technologies:
  - Astro
  - Tailwind CSS
  - MDX
  - TypeScript
  - date-fns
  - Content Collections
category: "sitio-web"
status: "público"
repoUrl: "https://github.com/naujrevilo/galaxynews"
image: "/projects/galaxynews.svg"
featured: false
---

## Descripción del Proyecto

**Galaxy News** es un portal de noticias estático construido con Astro que demuestra cómo crear sitios de contenido dinámico usando Content Collections. El proyecto sirve como plantilla para blogs periodísticos, revistas digitales o sitios de noticias con múltiples categorías.

### Características Principales

- **Content Collections**: Artículos tipados con validación Zod
- **Sistema de Categorías**: Navegación por política, deportes, tecnología, economía, entretenimiento
- **Fechas Relativas**: Formato "hace 2 horas" con date-fns y localización en español
- **Artículos Destacados**: Sección hero con los 3 posts más recientes
- **Diseño de Tarjetas**: Grid responsive con imágenes, categoría y extracto
- **Vista de Detalle**: Página individual por artículo con tipografía optimizada
- **Imágenes Externas**: Integración con Unsplash para assets
- **SEO Básico**: Meta tags por página y artículo

### Stack Tecnológico

- **Astro 5**: Framework estático con enrutamiento file-based
- **Tailwind CSS 3**: Utility-first styling con tema personalizado
- **@tailwindcss/typography**: Plugin para prosa de artículos
- **date-fns**: Librería moderna de fechas con locale español
- **MDX**: Markdown extendido con componentes
- **TypeScript**: Tipado estricto para schemas

### Arquitectura

```
src/
├── components/
│   ├── Header.astro       # Cabecera con navegación
│   ├── Footer.astro       # Pie de página con links
│   └── ArticleCard.astro  # Tarjeta de preview
├── content/
│   ├── articles/          # Markdown de artículos
│   │   ├── ejemplo-politica.md
│   │   └── ejemplo-tecnologia.md
│   └── config.ts          # Schema Zod de artículos
├── layouts/
│   └── BaseLayout.astro   # Layout base con SEO
└── pages/
    ├── index.astro            # Homepage
    ├── ultimas.astro          # Todas las noticias
    ├── articulos/
    │   └── [...slug].astro    # Detalle de artículo
    └── categoria/
        └── [category].astro   # Filtro por categoría
```

### Schema de Artículos

Definido en `src/content/config.ts`:

```typescript
const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    author: z.string(),
    category: z.enum([
      'politica', 
      'deportes', 
      'tecnologia', 
      'economia', 
      'entretenimiento'
    ]),
    image: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});
```

### Ejemplo de Artículo

```markdown
---
title: "Crisis política desata debate sobre reformas institucionales"
description: "Expertos analizan la necesidad de cambios estructurales"
pubDate: 2024-03-20
author: "María González"
category: "politica"
image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620"
featured: true
---

# Crisis política desata debate sobre reformas institucionales

La reciente crisis política ha generado un intenso debate...

## Puntos clave del debate

- Reforma del sistema electoral
- Transparencia en la gestión pública
- Modernización de las instituciones
```

### Categorías Disponibles

El sitio organiza contenido en 5 categorías principales:

| Categoría | Slug | Descripción |
|-----------|------|-------------|
| Política | `politica` | Noticias de gobierno y democracia |
| Deportes | `deportes` | Cobertura deportiva |
| Tecnología | `tecnologia` | Innovación y desarrollo tech |
| Economía | `economia` | Finanzas y mercados |
| Entretenimiento | `entretenimiento` | Cultura y espectáculos |

### Navegación por Categorías

Rutas dinámicas con `getStaticPaths()`:

```astro
// src/pages/categoria/[category].astro
export async function getStaticPaths() {
  const categories = ['politica', 'deportes', ...];
  return categories.map(category => ({
    params: { category },
  }));
}
```

Cada página filtra artículos por categoría y los ordena cronológicamente.

### Páginas del Sitio

**Homepage (`/`)**:

- Sección de 3 artículos destacados
- Grid de últimas 6 noticias
- Cards con imagen, categoría, título y fecha relativa

**Últimas (`/ultimas`)**:

- Lista completa de artículos
- Ordenados por fecha descendente

**Detalle (`/articulos/[slug]`)**:

- Imagen hero full-width
- Metadata: fecha, categoría, autor
- Contenido renderizado con `<Content />`
- Estilos de prosa Tailwind

**Categoría (`/categoria/[category]`)**:

- Título de categoría
- Grid de artículos filtrados
- Mensaje si no hay contenido

### Tipografía y Estilos

**Fuente principal**: Inter Variable (sans-serif moderno)

**Paleta de colores**:

```javascript
// tailwind.config.mjs
colors: {
  primary: '#1a365d',    // Azul oscuro
  secondary: '#2b6cb0',  // Azul medio
}
```

**Plugin typography**:

```css
.prose {
  @apply text-gray-800;
}
.prose h2 {
  @apply text-3xl font-bold mt-8 mb-4;
}
.prose p {
  @apply mb-4 leading-relaxed;
}
```

### Formato de Fechas

Usando `date-fns` con locale español:

```typescript
import { formatDistance } from 'date-fns';
import { es } from 'date-fns/locale';

const timeAgo = formatDistance(pubDate, new Date(), { 
  addSuffix: true,
  locale: es
});
// Resultado: "hace 2 horas", "hace 3 días"
```

### Componentes Clave

**ArticleCard.astro**:

- Props: title, description, pubDate, category, slug, image
- Imagen opcional con object-cover
- Link a categoría y detalle
- Hover: scale transform suave

**Header.astro**:

- Logo/título enlazado a home
- Navegación principal: Inicio, Últimas
- Barra de categorías con scroll horizontal
- Highlight de ruta activa

**Footer.astro**:

- Grid de 3 columnas: sobre, secciones, social
- Links a categorías
- Copyright dinámico con año actual

### Imágenes con Unsplash

El proyecto usa URLs de Unsplash con parámetros de optimización:

```
https://images.unsplash.com/photo-ID?q=80
```

Parámetro `q=80` para compresión balanceada calidad/tamaño.

### Build y Deploy

**Comandos**:

```bash
# Desarrollo
npm run dev          # localhost:4321

# Producción
npm run build        # ./dist/
npm run preview      # Preview local del build
```

**Output**: Sitio estático 100% con HTML pre-renderizado.

**Deploy**: Compatible con Netlify, Vercel, Cloudflare Pages, GitHub Pages.

### Patrones de Astro Demostrados

1. **Content Collections**: Tipado y validación de contenido
2. **Dynamic Routes**: `[...slug]` y `[category]`
3. **getStaticPaths**: Generación de rutas en build time
4. **Component Props**: Tipado estricto con interfaces
5. **Layout Nesting**: BaseLayout → Page → Components
6. **View Transitions**: Navegación SPA-like

### Posibles Extensiones

- [ ] Paginación para /ultimas y categorías
- [ ] Búsqueda full-text (Pagefind o Algolia)
- [ ] Tags adicionales más allá de categorías
- [ ] Related posts por categoría
- [ ] Sistema de comentarios (Giscus, Utterances)
- [ ] RSS feed automático
- [ ] Analytics básico
- [ ] Dark mode toggle

### Performance

- **Sin JavaScript del lado del cliente** (solo para Astro transitions)
- **Imágenes lazy-loaded** automáticamente por navegador
- **CSS minificado** con Tailwind purge
- **HTML estático** cacheado eficientemente

### Objetivo Educativo

Este proyecto sirve como:

- **Template base** para sitios de noticias con Astro
- **Ejemplo de Content Collections** bien estructurado
- **Demo de diseño responsive** con Tailwind
- **Patrón de categorización** reutilizable

### Versión Actual

✅ **v1.0.0** - Template funcional listo para personalizar

### Licencia

MIT

---

**Nota**: Este proyecto es ideal para aprender fundamentos de Astro, Content Collections y diseño de layouts informativos con Tailwind CSS.
