# Pasos para Publicar el Sitio Web

> **Fecha:** 15 de Enero 2026  
> **Versión sitio:** 3.0.0  
> **Estado:** Listo para publicación

---

## ✅ Cambios Realizados

### Servicios Publicados (15 servicios disponibles)

| Código | Servicio | Categoría | Precio Base |
|--------|----------|-----------|-------------|
| **SEC-01** | Seguridad de Computadores, Redes e Internet | Security | $3.500.000 |
| **SEC-04** | Recuperación de Desastres (DRP/BCP) | Security | $4.500.000 |
| **SEC-05** | Redes Privadas Virtuales (VPN) | Security | $1.200.000 |
| **INF-01** | Arquitectura de Sistemas | Infrastructure | $4.200.000 |
| **INF-02** | Diseño de Redes LAN | Infrastructure | $2.500.000 |
| **INF-03** | Servicios de Centros de Datos | Infrastructure | $8.000.000 |
| **INF-04** | Almacenamiento de Datos | Infrastructure | $2.200.000 |
| **INF-07** | Comunicaciones Unificadas (VoIP/UC) | Infrastructure | $3.200.000 |
| **DEV-01** | Ingeniería de Software | Development | $6.500.000 |
| **DEV-02** | Integración de Sistemas | Development | $4.800.000 |
| **DEV-03** | Diseño de Bases de Datos | Development | $3.200.000 |
| **DEV-04** | Diseño de Sitios Web | Development | $2.800.000 |
| **DEV-05** | Procesamiento de Datos en Línea | Development | $4.500.000 |
| **CON-01** | Planificación de Sistemas | Consulting | $3.500.000 |
| **CON-03** | Documentación Técnica | Consulting | $120.000/hora |

### Servicios Ocultos (marcados como "Próximamente")

| Código | Servicio | Plataforma Requerida | Disponible |
|--------|----------|---------------------|------------|
| **SEC-02** | Análisis de Riesgo | Risk Analyzer | Q2 2026 |
| **SEC-06** | Auditoría de Seguridad | Cloud Auditor | Q3 2026 |
| **SEC-07** | Ethical Hacking & Pentesting | PenTest Portal | Q1 2027 |
| **INF-06** | Administración de Servidores | MSP Hub | Q4 2026 |
| **MSP-01** | Seguridad TI Gestionada | MSP Hub | Q4 2026 |
| **SAAS-01** | Auditoría Cloud | Cloud Auditor | Q3 2026 |
| **SAAS-02** | Gestor SGSI | SGSI Manager | Q1 2026 |

---

## 🚀 Opciones de Publicación

### Opción 1: Azure Static Web Apps (Recomendado)

**Ventajas:**
- Hosting gratuito para sitios pequeños
- CI/CD automático con GitHub
- CDN global incluido
- SSL automático
- Integración perfecta con Azure Functions (para futuras plataformas)

**Pasos:**

1. **Crear recurso en Azure Portal**
```bash
# Login a Azure CLI
az login

# Crear grupo de recursos
az group create --name rg-juanoliver-web --location eastus

# Crear Static Web App
az staticwebapp create \
  --name swa-juanoliver \
  --resource-group rg-juanoliver-web \
  --source https://github.com/TU_USUARIO/juanoliverdotnetv3 \
  --branch main \
  --app-location "/" \
  --output-location "dist/client" \
  --login-with-github
```

2. **Configurar dominio personalizado**
   - En Azure Portal → Static Web App → Custom domains
   - Agregar dominio: `juanoliver.com` o `www.juanoliver.com`
   - Configurar DNS:
     ```
     CNAME www  →  swa-juanoliver.azurestaticapps.net
     A     @    →  [IP proporcionada por Azure]
     ```

3. **Deploy automático**
   - Azure crea un GitHub Action automáticamente
   - Cada push a `main` despliega automáticamente
   - El workflow está en `.github/workflows/azure-static-web-apps-*.yml`

---

### Opción 2: Netlify

**Ventajas:**
- Setup más rápido
- UI más amigable
- Formularios gratuitos
- Deploy previews automáticos

**Pasos:**

1. **Conectar repositorio en Netlify**
   - Ir a https://app.netlify.com
   - "Add new site" → "Import an existing project"
   - Conectar GitHub
   - Seleccionar repositorio `juanoliverdotnetv3`

2. **Configurar build settings**
   ```
   Build command: pnpm build
   Publish directory: dist/client
   ```

3. **Variables de entorno** (si son necesarias)
   - En Settings → Environment variables
   - Agregar cualquier API key o secreto

4. **Dominio personalizado**
   - Settings → Domain management
   - Add custom domain: `juanoliver.com`
   - Configurar DNS según instrucciones de Netlify

---

### Opción 3: Vercel

**Ventajas:**
- Excelente para Astro
- Edge functions incluidas
- Analytics gratuitos

**Pasos:**

1. **Importar proyecto**
   - https://vercel.com/new
   - Import Git Repository
   - Seleccionar repo de GitHub

2. **Framework Preset**
   - Vercel detecta automáticamente Astro
   - Build Command: `pnpm build`
   - Output Directory: `dist/client`

3. **Deploy**
   - Click "Deploy"
   - Esperar ~2 minutos

---

## 📋 Checklist Pre-Publicación

- [x] Build exitoso (`pnpm build`)
- [x] Servicios con precios asignados
- [x] Servicios que requieren plataforma marcados como "próximamente"
- [x] managedServices temporalmente ocultos
- [ ] Probar localmente (`pnpm preview`)
- [ ] Verificar todas las páginas (/, /servicios, /blog, /contacto)
- [ ] Verificar responsive design (móvil/tablet/desktop)
- [ ] Verificar modo oscuro
- [ ] Actualizar README.md con nueva versión
- [ ] Crear tag en Git: `v3.0.0`
- [ ] Push a repositorio

---

## 🔄 Comandos Importantes

### Desarrollo local
```bash
pnpm dev
```

### Build de producción
```bash
pnpm build
```

### Preview del build
```bash
pnpm preview
```

### Linting
```bash
pnpm lint
```

### Tests (si están configurados)
```bash
pnpm test
```

---

## 📊 Estructura del Deployment

```
dist/
├── client/              # Frontend estático (publicar este directorio)
│   ├── index.html
│   ├── servicios/
│   ├── _astro/         # Assets optimizados
│   └── ...
└── server/              # Backend Node.js (para modo SSR, actualmente no usado)
```

**IMPORTANTE:** Publicar solo la carpeta `dist/client` en Static Web Apps/Netlify/Vercel.

---

## 🎯 Post-Publicación

### 1. Verificar SEO
- [ ] Google Search Console
- [ ] Generar y subir sitemap.xml
- [ ] Verificar meta tags
- [ ] Verificar structured data

### 2. Monitoreo
- [ ] Google Analytics (si está configurado)
- [ ] Verificar errores en consola del navegador
- [ ] Probar formulario de contacto

### 3. Performance
- [ ] PageSpeed Insights: https://pagespeed.web.dev/
- [ ] GTmetrix: https://gtmetrix.com/
- [ ] Target: >90 en todas las métricas

---

## 🔐 Variables de Entorno (si necesitas)

Si en el futuro necesitas API keys o configuración sensible:

```bash
# .env.production (NO commitear)
PUBLIC_SITE_URL=https://juanoliver.com
PUBLIC_CONTACT_EMAIL=contacto@juanoliver.com
```

En Azure Static Web Apps:
```bash
az staticwebapp appsettings set \
  --name swa-juanoliver \
  --setting-names PUBLIC_SITE_URL=https://juanoliver.com
```

En Netlify: Settings → Environment variables  
En Vercel: Settings → Environment Variables

---

## 📝 DNS Configuration

Si usas un dominio personalizado (ej: juanoliver.com):

### Para Azure Static Web Apps
```
Type    Name    Value
A       @       20.50.x.x (IP de Azure)
CNAME   www     swa-juanoliver.azurestaticapps.net
TXT     @       [verification code de Azure]
```

### Para Netlify
```
Type    Name    Value
A       @       75.2.60.5
CNAME   www     [tu-sitio].netlify.app
```

### Para Vercel
```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

**TTL recomendado:** 3600 (1 hora)

---

## 🚨 Troubleshooting

### Build falla
```bash
# Limpiar cache
rm -rf node_modules .astro dist
pnpm install
pnpm build
```

### 404 en rutas
- Verificar que `output: 'server'` en `astro.config.mjs`
- Verificar que el adaptador de Node.js está configurado

### Assets no cargan
- Verificar que `dist/client/_astro/` contiene los archivos
- Verificar CORS headers si usas CDN externo

---

## 📞 Soporte

Si tienes problemas durante el deployment:
- Azure: https://docs.microsoft.com/azure/static-web-apps/
- Netlify: https://docs.netlify.com/
- Vercel: https://vercel.com/docs
- Astro: https://docs.astro.build/

---

*Documento generado: Enero 15, 2026*
