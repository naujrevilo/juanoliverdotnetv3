# Componentes Reutilizables

Este proyecto utiliza componentes Astro reutilizables para mantener coherencia visual y facilitar el mantenimiento.

## Componentes de UI

### PageHero

Hero de página completo con efectos de fondo animados, badge opcional y estadísticas.

**Props:**

- `title` (string, requerido): Título principal (acepta HTML)
- `subtitle` (string, requerido): Subtítulo descriptivo
- `badge` (objeto, opcional): `{ icon: string, text: string }`
- `stats` (array, opcional): Array de `{ value: string, label: string }`
- `variant` ('default' | 'compact' | 'minimal', opcional): Variante de tamaño
- `highlightText` (string, opcional): Texto del subtítulo a resaltar con efecto neon

**Ejemplo:**

```astro
<PageHero 
    title="Tienda <span class='neon-text text-security-yellow'>Especializada</span>"
    subtitle="Hardware y software de seguridad seleccionado por expertos"
    highlightText="seleccionado por expertos"
    variant="compact"
    badge={{
        icon: "<path d='...'/>",
        text: "Catálogo Profesional"
    }}
    stats={[
        { value: "500+", label: "Productos" },
        { value: "100%", label: "Certificados" }
    ]}
/>
```

---

### DocsHero

Hero compacto diseñado específicamente para páginas de documentación de Starlight. Se integra en archivos MDX.

**Props:**

- `title` (string, requerido): Título principal
- `subtitle` (string, opcional): Subtítulo descriptivo
- `badge` (objeto, opcional): `{ icon: string, text: string }`

**Características:**

- Márgenes negativos automáticos para ocupar todo el ancho en Starlight
- Diseño compacto optimizado para docs
- Efectos de fondo sutiles
- Clase `not-content` para evitar estilos de Starlight

**Ejemplo:**

```astro
import DocsHero from '../../../components/docs/DocsHero.astro';

<DocsHero 
    title="Guía Básica de Hardening"
    subtitle="Pasos esenciales para asegurar servidores Linux"
    badge={{
        icon: "<path d='...'/>",
        text: "Hardening & Security"
    }}
/>
```

---

### ContentCard

Tarjeta de contenido con gradiente decorativo, icono opcional y categoría.

**Props:**

- `title` (string, requerido): Título de la tarjeta
- `description` (string, requerido): Descripción del contenido
- `category` (string, opcional): Etiqueta de categoría
- `icon` (string, opcional): HTML del icono
- `accentColor` ('blue' | 'red' | 'yellow' | 'green' | 'cyan', opcional): Color de acento
- `href` (string, opcional): Si se proporciona, renderiza como link
- `className` (string, opcional): Clases CSS adicionales

**Ejemplo:**

```astro
<ContentCard
    title="Microsoft"
    category="Cloud & Security"
    description="Soluciones de seguridad en la nube..."
    accentColor="blue"
/>
```

---

### CTABox

Caja de llamado a la acción (Call To Action) centrada con botón.

**Props:**

- `title` (string, requerido): Título del CTA
- `description` (string, requerido): Descripción
- `buttonText` (string, requerido): Texto del botón
- `buttonHref` (string, requerido): URL del botón
- `variant` ('default' | 'compact', opcional): Variante de tamaño
- `className` (string, opcional): Clases CSS adicionales

**Ejemplo:**

```astro
<CTABox 
    title="¿Interesado en formar una alianza?"
    description="Buscamos expandir nuestro ecosistema..."
    buttonText="Contactar para Partnership"
    buttonHref="/contacto"
/>
```

---

### SectionBadge

Badge decorativo para secciones con icono opcional.

**Props:**

- `text` (string, requerido): Texto del badge
- `icon` (string, opcional): Path SVG del icono
- `className` (string, opcional): Clases CSS adicionales

**Ejemplo:**

```astro
<SectionBadge 
    icon="<path d='...'/>"
    text="Catálogo Profesional"
/>
```

---

### StatsBar

Barra de estadísticas con separadores opcionales.

**Props:**

- `stats` (array, requerido): Array de `{ value: string, label: string }`
- `variant` ('horizontal' | 'grid', opcional): Disposición de las estadísticas
- `className` (string, opcional): Clases CSS adicionales

**Ejemplo:**

```astro
<StatsBar 
    stats={[
        { value: "15+", label: "Años Experiencia" },
        { value: "100+", label: "Proyectos" }
    ]}
    variant="horizontal"
/>
```

---

## Componentes Svelte

### StoreFilters

Formulario de filtros para la tienda con búsqueda y categorías.

**Props:**

- `search` (string): Término de búsqueda inicial
- `category` (string): Categoría seleccionada

---

### StoreList

Grid de productos con tarjetas interactivas.

**Props:**

- `products` (array): Array de productos con estructura `Product`

---

## Layouts

### Layout

Layout principal con header, footer y soporte para fullWidth.

**Props:**

- `title` (string, requerido): Título de la página
- `description` (string, opcional): Meta descripción
- `fullWidth` (boolean, opcional): Si es true, el contenido no tiene container

**Uso con fullWidth:**

```astro
<Layout title="Tienda" fullWidth={true}>
    <PageHero ... />
    <div class="container mx-auto px-4">
        <!-- Contenido con ancho limitado aquí -->
    </div>
</Layout>
```

---

## Convenciones de Diseño

### Colores de Seguridad

- `security-blue`: #001A5A (azul principal)
- `security-red`: #981628 (rojo de alerta)
- `security-yellow`: #D19219 (amarillo de acento)

### Efectos Reutilizables

- `.neon-text`: Efecto de texto con resplandor neon
- `.neon-border`: Borde con efecto neon
- `.gradient-text`: Texto con gradiente
- `.gradient-text-animated`: Texto con gradiente animado
- `.glass-card`: Tarjeta con efecto glassmorphism
- `.card-hover-lift`: Animación de elevación al hover
- `.pattern-circuit`: Patrón de circuito de fondo

### Animaciones

- `animate-float`: Flotación suave
- `animate-pulse-glow`: Pulso con resplandor
- `scan-line`: Línea de escaneo vertical

---

## Mejores Prácticas

1. **Usar fullWidth para heros:** Todos los PageHero deben renderizarse con `fullWidth={true}` en el Layout
2. **Componentizar repeticiones:** Si un patrón se usa 3+ veces, crear componente
3. **Props tipadas:** Usar TypeScript interfaces para todas las props
4. **Accesibilidad:** Incluir `data-aos` para animaciones de scroll
5. **Dark mode:** Todos los componentes deben soportar `dark:` variants
