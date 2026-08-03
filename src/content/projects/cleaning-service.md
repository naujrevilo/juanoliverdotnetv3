---
title: "CleaningService"
description: "Sitio demo de servicio profesional de limpieza residencial y empresarial en Colombia. Construido con Astro 7, Svelte 5 y Tailwind CSS 4, con sistema de diseño propio y deploy en Cloudflare Pages."
longDescription: "Demo de sitio corporativo para un servicio de limpieza colombiano, con arquitectura Islands de Astro 7, sistema de diseño en tokens de Tailwind 4, validación de formularios con Svelte 5 runes, SEO completo con JSON-LD LocalBusiness y deploy estático en Cloudflare Pages."
publishDate: 2026-08-03
technologies:
  - Astro 7
  - Svelte 5
  - Tailwind CSS 4
  - TypeScript
  - Cloudflare Pages
  - JSON-LD
  - Open Graph
  - Islands Architecture
category: "sitio-web"
status: "público"
demoUrl: "https://cleaningserviceco.pages.dev/"
repoUrl: "https://github.com/naujrevilo/cleaning-service"
image: "/projects/cleaning-service.svg"
featured: true
---

## Descripción del Proyecto

**CleaningService** es un sitio demo de una empresa ficticia de servicios profesionales de limpieza residencial y empresarial en Colombia. El proyecto funciona como vitrina de patrones de desarrollo: arquitectura Islands, sistema de diseño con tokens, accesibilidad, SEO técnico y deploy estático en CDN global.

Como demo de diseño y desarrollo, todo el contenido — dirección, teléfono, reseñas, equipo, blog — es **placeholder** y no corresponde a un negocio real. La página está construida para que la conversión visual de los componentes (hero, cards, pricing, formularios, blog) pueda auditarse sin distracciones de branding real.

### Características Principales

- **Arquitectura Islands**: solo 5 componentes Svelte se hidratan en el cliente (`ContactForm`, `MobileMenu`, `Newsletter`, `PricingTabs`, `ReviewsCarousel`). El resto es HTML estático
- **Sistema de diseño propio**: tokens de marca (verde `#23A653` + azul acento `#10A1D2`) definidos en `@theme` de Tailwind 4, sin `tailwind.config.js`
- **Pricing interactivo**: toggle mensual/anual con `Intl.NumberFormat("es-CO")` para COP y destacado del plan "Más elegido"
- **Formulario validado**: validación client-side en `ContactForm.svelte` con `$state` y `bind:value`, manejo de errores por campo, estado de envío y mensaje de éxito
- **SEO completo**: meta tags, Open Graph, Twitter Cards, JSON-LD `LocalBusiness` con dirección, geo, horarios y perfiles sociales
- **Accesibilidad**: ARIA labels, `aria-live`, `aria-invalid`, `prefers-reduced-motion`, `focus-visible` con outline de marca
- **Performance**: `loading="lazy"`, `fetchpriority="high"` en hero, fuentes con `preconnect`, animaciones CSS sin JS
- **Mobile-first**: breakpoints consistentes, menú hamburguesa con `client:load`, diseño responsive en todas las páginas
- **Carrusel de reseñas**: `ReviewsCarousel` con autoplay y controles
- **Newsletter doble**: formulario inline en footer + bloque dedicado en home
- **Blog dinámico**: rutas `[slug].astro` con posts tipados en `src/data/posts.ts`

### Stack Tecnológico

- **Astro 7.1** — framework con `getStaticPaths()`, file-based routing y soporte para islands
- **Svelte 5.56 (Runes)** — componentes interactivos con `$state`, `$derived`, `$effect`
- **Tailwind CSS 4.3** — utility-first con `@theme` directive y CSS-first config
- **TypeScript 6** — modo `strict` con `astro/tsconfigs/strict`
- **@astrojs/sitemap** — generación automática de sitemap
- **Inter** (Google Fonts) — tipografía con `preconnect` y `font-display: swap`

### Arquitectura

```
src/
├── components/                # Componentes Astro (estáticos, server-rendered)
│   ├── About.astro
│   ├── Blog.astro
│   ├── Contact.astro
│   ├── Footer.astro
│   ├── Header.astro
│   ├── Hero.astro
│   ├── Logo.astro
│   ├── PageHero.astro
│   ├── Pricing.astro
│   ├── Reviews.astro
│   ├── Services.astro
│   ├── Team.astro
│   └── islands/               # Componentes Svelte (interactivos, client-hydrated)
│       ├── ContactForm.svelte
│       ├── MobileMenu.svelte
│       ├── Newsletter.svelte
│       ├── PricingTabs.svelte
│       └── ReviewsCarousel.svelte
├── data/
│   └── posts.ts               # Posts del blog (hardcoded, tipados)
├── layouts/
│   └── Layout.astro           # SEO, OG, JSON-LD, fuentes
├── pages/                     # Rutas file-based
│   ├── index.astro
│   ├── contacto.astro
│   ├── equipo.astro
│   ├── nosotros.astro
│   ├── opiniones.astro
│   ├── precios.astro
│   ├── servicios.astro
│   └── blog/
│       ├── index.astro
│       └── [slug].astro
└── styles/
    └── global.css             # Design tokens + componentes utilitarios
```

### Sistema de Diseño

Los tokens viven en `src/styles/global.css` dentro del bloque `@theme`:

- **Brand** — verde `#23A653` (CTAs primarios, badges, focus ring). Escala 50-950.
- **Accent** — azul cielo `#10A1D2` (contrastes, calificaciones, decorativos). Escala 50-900.
- **Ink** — escala de grises de 50 a 900 para texto y bordes.
- **Surface** — blancos y fondo muted `#F7F9F8`.

Componentes utilitarios disponibles: `.btn-primary`, `.btn-ghost`, `.btn-outline-light`, `.card`, `.eyebrow`, `.container-x`, `.section-y`, `.blob`. La escala tipográfica usa `clamp()` para adaptarse al viewport sin breakpoints intermedios.

Animaciones: `float-slow` (6s) y `pulse-soft` (3s), con `prefers-reduced-motion` desactivando ambas automáticamente.

### Componentes Interactivos (Islands)

Solo 5 componentes Svelte se hidratan en el cliente:

**`ContactForm.svelte`** — formulario de cotización con validación en tiempo real. Usa `$state` para `name`, `email`, `phone`, `service`, `message`, `submitting`, `submitted`, `errors`. La validación corre client-side antes del envío (placeholder de backend).

**`MobileMenu.svelte`** — menú hamburguesa full-screen con animación staggered. Hidratado con `client:load` para que esté listo inmediatamente al cargar la página.

**`PricingTabs.svelte`** — toggle entre planes mensuales y anuales. Usa `$state` para `period` y `Intl.NumberFormat("es-CO", { currency: "COP" })` para formatear precios en pesos colombianos.

**`ReviewsCarousel.svelte`** — carrusel de reseñas con autoplay. Acepta array de reseñas como prop, navega con flechas y dots.

**`Newsletter.svelte`** — formulario inline de suscripción. Usado en footer y en bloque dedicado en home. Mismo patrón de validación que `ContactForm`.

### SEO y JSON-LD

El layout principal inyecta metadata completa en cada página:

- **Open Graph**: `og:type`, `og:url`, `og:title`, `og:description`, `og:image`, `og:locale: "es_CO"`, `og:site_name`
- **Twitter Cards**: `summary_large_image` con `twitter:url/title/description/image`
- **JSON-LD `LocalBusiness`**: nombre, imagen, descripción, URL, teléfono, `priceRange`, dirección postal, geo (`4.711, -74.0721`), horarios (`Monday-Saturday 07:00-19:00`) y perfiles sociales
- **Canonical URL**: derivado de `Astro.url.pathname` + `Astro.site`
- **Sitemap**: generado por `@astrojs/sitemap` en build

### Performance

- **Islands Architecture**: solo 5 componentes con JS en cliente, el resto es HTML estático
- **CSS-first**: animaciones de float y pulse definidas en CSS, no en JS
- **Lazy loading**: todas las imágenes no-críticas usan `loading="lazy"` y `decoding="async"`
- **Critical images**: el hero usa `fetchpriority="high"` y `loading="eager"`
- **Fuentes**: Inter cargada con `preconnect` a `fonts.googleapis.com` y `fonts.gstatic.com`
- **Pre-renderizado**: todas las páginas pre-renderizadas en build, servidas como activos estáticos

### Deploy en Cloudflare Pages

El sitio se despliega como Pages estático:

1. Conectar el repo `naujrevilo/cleaning-service` a Cloudflare Pages
2. Framework preset: **Astro**
3. Build command: `pnpm build`
4. Output directory: `dist`
5. Node version: `22.12+`

El CDN global de Cloudflare sirve los assets estáticos con cache edge automático.

### Scripts Disponibles

| Comando       | Descripción                                                    |
| ------------- | -------------------------------------------------------------- |
| `pnpm install`| Instalar dependencias                                          |
| `pnpm dev`    | Servidor de desarrollo (en background según `AGENTS.md`)       |
| `pnpm build`  | Build de producción                                            |
| `pnpm preview`| Preview del build localmente                                   |

### Nota Demo

Este proyecto es una **demo de diseño y desarrollo**, no un negocio real:

- La dirección, teléfono y reseñas son **placeholder** y no corresponden a una empresa existente
- El **formulario de contacto no envía datos** a ningún backend; simula la petición con `setTimeout` en `ContactForm.svelte`
- Los **enlaces de redes sociales** del footer apuntan a `#` como placeholder
- Las **imágenes** son de demostración y deben reemplazarse antes de cualquier uso público
- El blog está **hardcodeado** en `src/data/posts.ts`; para producción conviene migrar a Content Collections o un CMS

Para usar como base de un proyecto real: reemplazar contenido, conectar el formulario a un endpoint (Resend, Formspree o un endpoint de Astro) y optimizar las imágenes con `astro:assets`.

### Versión Actual

✅ **v0.1.0** — demo funcional con sistema de diseño completo y todas las páginas navegables

### Licencia

MIT
