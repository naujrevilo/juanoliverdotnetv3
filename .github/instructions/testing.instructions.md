---
alwaysApply: false
always_on: false
trigger: on_demand
applyTo: "**/*.{test,spec}.{ts,tsx,js}"
description: Guía para generar y ejecutar tests en el proyecto
---

# Guía de Testing

## Estrategia de Testing

Este proyecto usa una estrategia de testing en capas:

1. **Unit Tests** (Vitest) - Lógica de negocio, utilidades, servicios
2. **Component Tests** (Vitest + Testing Library) - Componentes aislados
3. **E2E Tests** (Playwright) - Flujos críticos de usuario
4. **Security Scans** (Snyk) - Vulnerabilidades en código y dependencias

## Configuración

### Vitest (Unit + Component)

```bash
# Ejecutar todos los tests
pnpm test

# Watch mode durante desarrollo
pnpm test:watch

# Coverage report
pnpm test:coverage
```

### Playwright (E2E)

```bash
# Ejecutar E2E tests
pnpm test:e2e

# UI mode para debugging
pnpm test:e2e --ui

# Ejecutar un test específico
pnpm test:e2e tests/home.spec.ts
```

## Estructura de Tests

```
tests/
├── unit/                    # Tests unitarios
│   ├── services/
│   │   └── products.test.ts
│   └── data/
│       └── navigation.test.ts
├── components/              # Tests de componentes
│   └── BlogCard.test.ts
└── e2e/                     # Tests end-to-end
    ├── home.spec.ts
    ├── blog.spec.ts
    └── tienda.spec.ts
```

## Patrones de Testing

### Unit Tests - Servicios

```typescript
// tests/unit/services/products.test.ts
import { describe, it, expect, vi } from "vitest";
import { getLocalProducts } from "../../../src/services/products";

describe("getLocalProducts", () => {
  it("should return empty array when no products exist", async () => {
    // Arrange
    vi.mock("../../../src/db/client", () => ({
      db: {
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            $dynamic: vi.fn().mockResolvedValue([]),
          }),
        }),
      },
    }));

    // Act
    const result = await getLocalProducts();

    // Assert
    expect(result).toEqual([]);
  });

  it("should filter products by search term", async () => {
    // Test implementation
  });
});
```

### Unit Tests - Utilidades

```typescript
// tests/unit/data/navigation.test.ts
import { describe, it, expect } from "vitest";
import { isActivePath, getAllFooterLinks } from "../../../src/data/navigation";

describe("isActivePath", () => {
  it("should return true for exact match on home", () => {
    expect(isActivePath("/", "/")).toBe(true);
  });

  it("should return true for nested paths", () => {
    expect(isActivePath("/blog/my-post", "/blog")).toBe(true);
  });

  it("should return false for non-matching paths", () => {
    expect(isActivePath("/about", "/blog")).toBe(false);
  });
});

describe("getAllFooterLinks", () => {
  it("should return flattened array of all footer links", () => {
    const links = getAllFooterLinks();
    expect(Array.isArray(links)).toBe(true);
    expect(links.length).toBeGreaterThan(0);
    expect(links[0]).toHaveProperty("href");
    expect(links[0]).toHaveProperty("label");
  });
});
```

### E2E Tests

```typescript
// tests/e2e/home.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test("should load and display hero section", async ({ page }) => {
    await page.goto("/");

    // Verificar elementos principales
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByRole("link", { name: /contacto/i })).toBeVisible();
  });

  test("should navigate to blog", async ({ page }) => {
    await page.goto("/");
    await page.click("text=Blog");

    await expect(page).toHaveURL("/blog");
    await expect(page.locator("h1")).toContainText("Blog");
  });

  test("should have working dark mode toggle", async ({ page }) => {
    await page.goto("/");

    const toggle = page.getByRole("button", { name: /tema/i });
    await toggle.click();

    await expect(page.locator("html")).toHaveClass(/dark/);
  });
});

test.describe("Store Page", () => {
  test("should load products", async ({ page }) => {
    await page.goto("/tienda");

    // Esperar a que carguen los productos
    await expect(
      page.locator('[data-testid="product-card"]').first()
    ).toBeVisible({
      timeout: 10000,
    });
  });

  test("should filter products by search", async ({ page }) => {
    await page.goto("/tienda");

    await page.fill('input[type="search"]', "ubiquiti");
    await page.keyboard.press("Enter");

    // Verificar que se muestran resultados filtrados
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount({
      minimum: 1,
    });
  });
});
```

## Convenciones de Testing

### Nombrado

- Tests unitarios: `*.test.ts`
- Tests E2E: `*.spec.ts`
- Describir comportamiento, no implementación

```typescript
// ✅ Correcto
it("should return empty array when database is empty");
it("should filter products by category");

// ❌ Incorrecto
it("test getProducts function");
it("works correctly");
```

### Arrange-Act-Assert

```typescript
it("should calculate price with tax", () => {
  // Arrange
  const price = 100;
  const taxRate = 0.19;

  // Act
  const result = calculatePriceWithTax(price, taxRate);

  // Assert
  expect(result).toBe(119);
});
```

### Mocking

```typescript
import { vi } from "vitest";

// Mock de módulos
vi.mock("../db/client", () => ({
  db: mockDb,
}));

// Mock de funciones
const mockFetch = vi.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve({ data: [] }),
});
vi.stubGlobal("fetch", mockFetch);
```

## Tests Críticos Requeridos

Antes de hacer merge a `main`, asegurar que estos tests pasan:

### Páginas Principales

- [ ] Home (`/`) carga correctamente
- [ ] Blog (`/blog`) muestra lista de posts
- [ ] Docs (`/docs`) renderiza Starlight
- [ ] Tienda (`/tienda`) carga productos
- [ ] 404 muestra página personalizada

### Seguridad

- [ ] Headers de seguridad presentes (CSP, HSTS)
- [ ] No hay secretos expuestos en el código
- [ ] Inputs validados con Zod

### Performance

- [ ] Lighthouse score > 90 en Performance
- [ ] LCP < 2.5s
- [ ] No hay errores en consola

## CI Integration

Los tests se ejecutan automáticamente en GitHub Actions:

```yaml
# .github/workflows/ci-cd.yml
- name: Run Tests
  run: pnpm test

- name: Run E2E Tests
  run: pnpm test:e2e
```
