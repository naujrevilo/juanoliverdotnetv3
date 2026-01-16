/**
 * Script para regenerar los iconos SVG y PNG con los colores del logo
 * Colores del logo:
 * - Security (Azul): #1C75BC
 * - Infrastructure (Navy): #262262
 * - Development (Naranja): #E68E27
 * - Consulting (Rojo): #B52733
 */

import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colores del logo por categoría
const categoryColors = {
  security: "#1C75BC",      // Azul
  infrastructure: "#262262", // Navy
  development: "#E68E27",    // Naranja
  consulting: "#B52733",     // Rojo
};

// Mapeo de archivos a categorías basado en services.json
const iconCategories = {
  "01-lock-seguridad-redes": "security",       // SEC-01
  "02-chart-analisis-riesgo": "security",      // SEC-02 (análisis de riesgo usa chart pero es security)
  "03-shield-check-mantenimiento": "security", // SEC-03
  "04-refresh-drp-bcp": "security",            // SEC-04
  "05-vpn-redes-privadas": "security",         // SEC-05
  "06-clipboard-auditoria": "security",        // SEC-06
  "07-layers-arquitectura": "infrastructure",  // INF-01
  "08-network-redes-lan": "infrastructure",    // INF-02
  "09-server-datacenter": "infrastructure",    // INF-03
  "10-database-almacenamiento": "infrastructure", // INF-04
  "11-code-ingenieria-software": "development",   // DEV-01
  "12-puzzle-integracion": "development",         // DEV-02
  "13-database-design-bases-datos": "development", // DEV-03
  "14-globe-sitios-web": "development",           // DEV-04
  "15-calendar-planificacion": "consulting",      // CON-01
  "16-support-soporte-tecnico": "consulting",     // CON-02
  "17-document-documentacion": "consulting",      // CON-03
};

// Paths de iconos SVG (heroicons style)
const iconPaths = {
  "01-lock-seguridad-redes": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />`,
  "02-chart-analisis-riesgo": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />`,
  "03-shield-check-mantenimiento": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />`,
  "04-refresh-drp-bcp": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />`,
  "05-vpn-redes-privadas": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.5 3.5L4 6l4.5 2.5M15.5 3.5L20 6l-4.5 2.5" />`,
  "06-clipboard-auditoria": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />`,
  "07-layers-arquitectura": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />`,
  "08-network-redes-lan": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 10v4M17 10v4M10 7h4M10 17h4" />`,
  "09-server-datacenter": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />`,
  "10-database-almacenamiento": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />`,
  "11-code-ingenieria-software": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />`,
  "12-puzzle-integracion": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />`,
  "13-database-design-bases-datos": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 11v4m-2-2h4" />`,
  "14-globe-sitios-web": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />`,
  "15-calendar-planificacion": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />`,
  "16-support-soporte-tecnico": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />`,
  "17-document-documentacion": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />`,
};

function createSvg(iconName, color, iconPath) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512" fill="none" stroke="${color}" aria-label="${iconName}">
  <rect x="0" y="0" width="24" height="24" fill="white" stroke="none"/>
  ${iconPath}
</svg>`;
}

async function regenerateIcons() {
  const outputDir = path.join(__dirname, "..", "public", "icons", "services");

  console.log("🎨 Regenerando iconos con colores del logo...\n");
  console.log("Colores:");
  console.log("  - Security:       #1C75BC (Azul)");
  console.log("  - Infrastructure: #262262 (Navy)");
  console.log("  - Development:    #E68E27 (Naranja)");
  console.log("  - Consulting:     #B52733 (Rojo)\n");

  for (const [iconName, category] of Object.entries(iconCategories)) {
    const color = categoryColors[category];
    const iconPath = iconPaths[iconName];

    if (!iconPath) {
      console.log(`⚠️  No se encontró path para: ${iconName}`);
      continue;
    }

    // Crear SVG
    const svgContent = createSvg(iconName, color, iconPath);
    const svgPath = path.join(outputDir, `${iconName}.svg`);
    fs.writeFileSync(svgPath, svgContent);
    console.log(`✅ SVG: ${iconName}.svg (${category} → ${color})`);

    // Crear PNG
    const pngPath = path.join(outputDir, `${iconName}.png`);
    await sharp(Buffer.from(svgContent))
      .resize(512, 512)
      .png()
      .toFile(pngPath);
    console.log(`✅ PNG: ${iconName}.png`);
  }

  console.log("\n🎉 ¡Iconos regenerados exitosamente!");
}

regenerateIcons().catch(console.error);
