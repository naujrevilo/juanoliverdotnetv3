---
alwaysApply: true
always_on: true
trigger: always_on
applyTo: "**/*.{ts,tsx,js,jsx,astro,svelte}"
description: Convenciones de estilo de código para el proyecto
---

# Convenciones de Estilo de Código

## Principios Generales

1. **Security by Design**: Todo código debe considerar seguridad desde el inicio
2. **TypeScript First**: Usar tipos estrictos, evitar `any`
3. **Documentación**: Añadir JSDoc a funciones públicas y exports

## Formato de Código

### TypeScript/JavaScript

```typescript
// ✅ Correcto: Usar const por defecto
const myValue = "something";

// ✅ Correcto: Tipos explícitos en funciones públicas
export function calculatePrice(amount: number, rate: number): number {
  return amount * rate;
}

// ✅ Correcto: Interfaces sobre types cuando es posible
export interface Product {
  id: number;
  name: string;
  price: number;
}

// ❌ Incorrecto: Evitar any
function process(data: any) {} // NO

// ✅ Correcto: Usar unknown y validar
function process(data: unknown): void {
  if (typeof data === "string") {
    // procesar
  }
}
```

### Componentes Astro

```astro
---
// 1. Imports primero
import Layout from '../layouts/Layout.astro';
import { getCollection } from 'astro:content';

// 2. Props interface
interface Props {
  title: string;
  description?: string;
}

// 3. Destructuring de props
const { title, description = 'Default description' } = Astro.props;

// 4. Lógica del componente
const posts = await getCollection('blog');
---

<!-- 5. Template HTML -->
<Layout title={title}>
  <h1>{title}</h1>
</Layout>
```

### Componentes Svelte 5

```svelte
<script lang="ts">
  // Usar Runes de Svelte 5
  let { items = [] }: { items: string[] } = $props();

  // Estado reactivo con $state
  let count = $state(0);

  // Efectos con $effect
  $effect(() => {
    console.log('Count changed:', count);
  });
</script>
```

## Nombrado

| Tipo                | Convención  | Ejemplo                              |
| ------------------- | ----------- | ------------------------------------ |
| Variables/funciones | camelCase   | `getUserData`, `isLoading`           |
| Constantes globales | UPPER_SNAKE | `API_BASE_URL`, `MAX_ITEMS`          |
| Interfaces/Types    | PascalCase  | `Product`, `UserProfile`             |
| Componentes         | PascalCase  | `BlogCard.astro`, `StoreList.svelte` |
| Archivos de datos   | kebab-case  | `partners.json`, `social.json`       |

## Imports

Ordenar imports en este orden:

1. Dependencias externas (`astro:content`, `drizzle-orm`)
2. Componentes internos (`../components/...`)
3. Utilidades y datos (`../data/...`, `../services/...`)
4. Tipos (al final, usando `import type`)

```typescript
// 1. Externos
import { defineCollection, z } from "astro:content";
import { like } from "drizzle-orm";

// 2. Componentes
import Layout from "../layouts/Layout.astro";
import BlogCard from "../components/BlogCard.astro";

// 3. Datos/Servicios
import { getAllProducts } from "../services/products";
import { mainNavLinks } from "../data/navigation";

// 4. Tipos
import type { Product } from "../services/products";
import type { NavLink } from "../data/navigation";
```

## Validación de Inputs

Siempre validar inputs de usuario con Zod:

```typescript
import { z } from "zod";

const ContactSchema = z.object({
  email: z.string().email(),
  message: z.string().min(10).max(1000),
  name: z.string().min(2).max(100),
});

// Validar
const result = ContactSchema.safeParse(formData);
if (!result.success) {
  // Manejar errores
}
```

## Manejo de Errores

```typescript
// ✅ Correcto: Try-catch con logging
try {
  const data = await fetchData();
  return data;
} catch (error) {
  console.error("Error fetching data:", error);
  return null; // o throw según el caso
}

// ✅ Correcto: Validación temprana
if (!token) {
  console.warn("Missing auth token");
  return { error: "Unauthorized" };
}
```

## Comentarios

```typescript
/**
 * Obtiene productos filtrados por categoría.
 *
 * @param category - Categoría a filtrar ('hardware', 'software', 'service')
 * @param options - Opciones adicionales de filtrado
 * @returns Lista de productos que coinciden con el filtro
 * @throws {Error} Si la conexión a la base de datos falla
 *
 * @example
 * const hardware = await getProductsByCategory('hardware');
 */
export async function getProductsByCategory(
  category: string,
  options?: FilterOptions
): Promise<Product[]> {
  // Implementación
}
```

## CSS/Tailwind

- Preferir clases de Tailwind sobre CSS personalizado
- Usar las variables CSS del tema (`--security-blue`, `--security-red`)
- Componentes reutilizables: usar `@apply` en `global.css`

```css
/* En global.css para patrones repetidos */
.glass-card {
  @apply bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl;
}
```
