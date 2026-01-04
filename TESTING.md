# Estrategia de Testing

Este documento define la estrategia de testing para el proyecto juanoliver.net.

## Estado Actual

> ⚠️ **Nota**: El proyecto actualmente no tiene tests automatizados configurados. Este documento sirve como guía para la implementación futura.

## Pirámide de Testing

```
        ╱╲
       ╱  ╲      E2E Tests (Playwright)
      ╱────╲     - Flujos críticos de usuario
     ╱      ╲    - 5-10 tests
    ╱────────╲
   ╱          ╲  Integration Tests
  ╱────────────╲ - APIs, servicios
 ╱              ╲- 20-30 tests
╱────────────────╲
        │        │ Unit Tests (Vitest)
        │        │ - Funciones puras, utilidades
        │        │ - 50+ tests
        └────────┘
```

## Herramientas Recomendadas

| Herramienta | Uso | Razón |
|-------------|-----|-------|
| **Vitest** | Unit + Integration | Rápido, compatible con Vite, TypeScript nativo |
| **Playwright** | E2E | Multi-browser, buenas herramientas de debugging |
| **Testing Library** | Component | Testing orientado al usuario |
| **MSW** | Mocking | Mock de APIs de forma realista |

## Configuración

### Instalar Dependencias

```bash
pnpm add -D vitest @testing-library/svelte @playwright/test msw
```

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/unit/**/*.test.ts', 'tests/components/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/', '*.config.*'],
    },
  },
});
```

### playwright.config.ts

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Scripts NPM

Añadir a `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

## Tests Prioritarios

### Fase 1: Unit Tests (Críticos)

| Archivo | Tests | Prioridad |
|---------|-------|-----------|
| `src/data/navigation.ts` | `isActivePath`, `getAllFooterLinks` | 🔴 Alta |
| `src/data/partners.ts` | `getFeaturedPartners`, `getPartnersByCategory` | 🟡 Media |
| `src/data/social.ts` | `getSocialByPlatform`, `getMainSocials` | 🟡 Media |
| `src/services/products.ts` | `getLocalProducts` (mock DB) | 🔴 Alta |

### Fase 2: E2E Tests (Críticos)

| Página | Tests | Prioridad |
|--------|-------|-----------|
| Home `/` | Carga, navegación, hero visible | 🔴 Alta |
| Blog `/blog` | Lista posts, navegación a post | 🔴 Alta |
| Docs `/docs` | Starlight renderiza, sidebar funciona | 🔴 Alta |
| Tienda `/tienda` | Carga productos, filtros funcionan | 🔴 Alta |
| 404 | Página personalizada se muestra | 🟡 Media |

### Fase 3: Integration Tests

| Servicio | Tests | Prioridad |
|----------|-------|-----------|
| Products API | Mock Syscom, verificar transformación | 🟡 Media |
| DB Client | Conexión Turso (mock) | 🟡 Media |
| Content Collections | Validación de schemas | 🟢 Baja |

## Cobertura de Código

### Objetivos

| Métrica | Objetivo | Mínimo |
|---------|----------|--------|
| Statements | 80% | 60% |
| Branches | 75% | 50% |
| Functions | 80% | 60% |
| Lines | 80% | 60% |

### Archivos Críticos (90%+ requerido)

- `src/services/products.ts`
- `src/db/schema.ts`
- `src/data/*.ts`

## Mocking

### Base de Datos (Turso)

```typescript
// tests/mocks/db.ts
import { vi } from 'vitest';

export const mockDb = {
  select: vi.fn().mockReturnValue({
    from: vi.fn().mockReturnValue({
      $dynamic: vi.fn().mockResolvedValue([]),
    }),
  }),
};

vi.mock('../src/db/client', () => ({
  db: mockDb,
}));
```

### API Externa (Syscom)

```typescript
// tests/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('https://developers.syscomcolombia.com/oauth/token', () => {
    return HttpResponse.json({
      access_token: 'mock_token',
      expires_in: 3600,
    });
  }),
  
  http.get('https://developers.syscomcolombia.com/api/v1/productos', () => {
    return HttpResponse.json({
      productos: [
        {
          producto_id: '1',
          titulo: 'Test Product',
          precios: { precio_lista: '100' },
          total_existencia: '10',
        },
      ],
      paginas: 1,
    });
  }),
];
```

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/ci-cd.yml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - run: pnpm install
      
      - name: Run Unit Tests
        run: pnpm test --coverage
      
      - name: Upload Coverage
        uses: codecov/codecov-action@v3
      
      - name: Install Playwright
        run: pnpm exec playwright install --with-deps
      
      - name: Run E2E Tests
        run: pnpm test:e2e
      
      - name: Upload Playwright Report
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

## Testing Manual (Checklist)

Antes de cada release a producción:

### Funcionalidad

- [ ] Home carga correctamente
- [ ] Navegación funciona en todas las páginas
- [ ] Blog muestra posts y se puede leer cada uno
- [ ] Docs renderiza correctamente con Starlight
- [ ] Tienda carga productos
- [ ] Filtros de tienda funcionan
- [ ] Formulario de contacto envía
- [ ] 404 muestra página personalizada
- [ ] Dark mode toggle funciona

### Responsive

- [ ] Mobile (320px)
- [ ] Tablet (768px)
- [ ] Desktop (1024px+)

### Navegadores

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### Performance

- [ ] Lighthouse Performance > 90
- [ ] Lighthouse Accessibility > 90
- [ ] No errores en consola

### Seguridad

- [ ] Headers de seguridad presentes
- [ ] HTTPS funciona
- [ ] No hay secretos expuestos

## Próximos Pasos

1. **Inmediato**: Configurar Vitest y escribir tests para `navigation.ts`
2. **Corto plazo**: Añadir tests E2E para páginas principales
3. **Medio plazo**: Configurar coverage reporting en CI
4. **Largo plazo**: Alcanzar 80% de cobertura
