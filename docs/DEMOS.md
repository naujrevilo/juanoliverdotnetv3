# Guía de Demos

Sistema para alojar demos interactivos dentro de `juanoliver.net/demos/`.

## Arquitectura

```
juanoliver.net/
├── /                          # Sitio principal (juanoliverdotnetv3)
├── /demos/newspaper/          # Demo: myNewspaper
├── /demos/<otro-demo>/        # Futuros demos
└── ...
```

Cada demo es un proyecto independiente con su propio repositorio, build y configuración. El repo principal solo contiene los archivos estáticos compilados en `public/demos/<nombre>/`.

## Flujo de trabajo para agregar un nuevo demo

### 1. Crear el proyecto del demo

```bash
# Crear repo independiente
mkdir mi-demo
cd mi-demo
git init
# Configurar proyecto (Astro, Svelte, etc.)
# ...
git add -A && git commit -m "feat: initial demo"
gh repo create naujrevilo/mi-demo --private --source=. --push
```

### 2. Configurar el build

El demo debe compilar a un directorio que contenga `index.html` y los assets. Ejemplo con Astro:

```js
// astro.config.mjs
export default defineConfig({
  site: "https://juanoliver.net",
  base: "/demos/mi-demo",  // Importante: debe coincidir con la ruta final
  output: "static",
});
```

### 3. Build y copia al repo principal

```bash
# En el repo del demo
pnpm build

# Copiar al repo principal
Copy-Item -Path "dist/client/demos/mi-demo/*" `
  -Destination "F:\projects\juanoliverdotnetv3\public\demos\mi-demo\" `
  -Recurse -Force
```

### 4. Commit y push del repo principal

```bash
cd F:\projects\juanoliverdotnetv3
git add public/demos/mi-demo
git commit -m "feat: agregar demo mi-demo en /demos/mi-demo"
git push
```

Cloudflare Pages reconstruirá automáticamente el sitio principal.

### 5. Verificar

Abrir `https://juanoliver.net/demos/mi-demo/` en el navegador.

## Actualizar un demo existente

```bash
# 1. En el repo del demo, hacer cambios y rebuild
cd F:\projects\mi-demo
pnpm build

# 2. Copiar al repo principal (sobreescribe archivos existentes)
Copy-Item -Path "dist/client/demos/mi-demo/*" `
  -Destination "F:\projects\juanoliverdotnetv3\public\demos\mi-demo\" `
  -Recurse -Force

# 3. Commit y push
cd F:\projects\juanoliverdotnetv3
git add public/demos/mi-demo
git commit -m "update: demo mi-demo"
git push
```

## Script de actualización rápida

Para simplificar el proceso, puede crear un script en el repo del demo:

```powershell
# scripts/deploy-to-main.ps1
param(
    [string]$DemoName = "mi-demo",
    [string]$MainRepo = "F:\projects\juanoliverdotnetv3"
)

Write-Host "Building demo..."
pnpm build

Write-Host "Copying to main repo..."
$source = "dist/client/demos/$DemoName/*"
$dest = "$MainRepo/public/demos/$DemoName/"
Copy-Item -Path $source -Destination $dest -Recurse -Force

Write-Host "Done. Commit and push from the main repo."
```

## Demos disponibles

| Demo | Ruta | Repo | Descripción |
|------|------|------|-------------|
| myNewspaper | `/demos/newspaper` | [naujrevilo/myNewNewspaper](https://github.com/naujrevilo/myNewspaper) | Periódico digital con Astro 7, Svelte 5, Tailwind CSS 4 |

## Consideraciones importantes

- **Base path**: El `base` en `astro.config.mjs` del demo debe ser `/demos/<nombre>` para que los assets se cargen correctamente.
- **Assets**: Los CSS, JS e imágenes se sirven desde `/demos/<nombre>/_astro/...`.
- **Imágenes externas**: Si el demo usa imágenes de terceros, asegurarse de que las URLs sigan siendo válidas.
- **Tamaño**: Los demos no deberían exceder 100MB en archivos compilados.
- **Seguridad**: Los demos son estáticos — no deben contener secretos ni datos sensibles.
