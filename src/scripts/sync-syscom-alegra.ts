/**
 * @fileoverview Script para sincronizar productos de Syscom Colombia a Alegra.
 * Ejecutar con: npx tsx src/scripts/sync-syscom-alegra.ts [opciones]
 *
 * Ejemplos:
 *   pnpm alegra:sync                          # Sync todas las categorías (20 por cat)
 *   pnpm alegra:sync --cat 22                 # Solo Videovigilancia
 *   pnpm alegra:sync --cat 26                 # Solo Redes
 *   pnpm alegra:sync --marca ubiquiti         # Solo marca Ubiquiti
 *   pnpm alegra:sync --marca hikvision        # Solo marca Hikvision
 *   pnpm alegra:sync --max 50                 # 50 productos por categoría/marca
 *   pnpm alegra:sync --marca ubiquiti --max 30
 *
 * @module scripts/sync-syscom-alegra
 */

import "dotenv/config";

// Verificar credenciales
const alegraEmail = process.env.ALEGRA_EMAIL;
const alegraToken = process.env.ALEGRA_TOKEN;
const syscomClientId = process.env.SYSCOM_CLIENT_ID;
const syscomClientSecret = process.env.SYSCOM_CLIENT_SECRET;

if (!alegraEmail || !alegraToken) {
  console.error("❌ Error: Configura ALEGRA_EMAIL y ALEGRA_TOKEN en .env");
  process.exit(1);
}

if (!syscomClientId || !syscomClientSecret) {
  console.error("❌ Error: Configura SYSCOM_CLIENT_ID y SYSCOM_CLIENT_SECRET en .env");
  process.exit(1);
}

// APIs
// URL de Alegra - Sandbox: https://sandbox.alegra.com:26967/api/v1
// Producción: https://api.alegra.com/api/v1
const ALEGRA_API_URL = process.env.ALEGRA_API_URL || "https://api.alegra.com/api/v1";
const SYSCOM_BASE_URL = "https://developers.syscomcolombia.com/api/v1";
const SYSCOM_AUTH_URL = "https://developers.syscomcolombia.com/oauth/token";

// Categorías de Syscom disponibles para sincronizar
const SYSCOM_CATEGORIES: Record<string, string> = {
  "22": "Videovigilancia",
  "26": "Redes",
  "37": "Control de Acceso",
  "30": "Energía",
  "32": "Automatización e Intrusión",
  "38": "Detección de Fuego",
  "65811": "Cableado Estructurado",
};

// Algunas marcas populares (IDs en minúsculas)
const POPULAR_BRANDS: Record<string, string> = {
  ubiquiti: "Ubiquiti Networks",
  hikvision: "Hikvision",
  dahua: "Dahua",
  mikrotik: "Mikrotik",
  cisco: "Cisco",
  tplink: "TP-Link",
  epcom: "EPCOM",
  syscom: "SYSCOM",
  zkteco: "ZKTeco",
  honeywell: "Honeywell",
  axis: "Axis",
  cambiumnetworks: "Cambium Networks",
  ruijie: "Ruijie",
};

// Cache de token Syscom
let syscomToken: string | null = null;
let tokenExpiry = 0;

// ============================================
// AUTENTICACIÓN
// ============================================

function getAlegraAuth(): string {
  return Buffer.from(`${alegraEmail}:${alegraToken}`).toString("base64");
}

async function getSyscomToken(): Promise<string | null> {
  if (syscomToken && Date.now() < tokenExpiry) {
    return syscomToken;
  }

  try {
    const response = await fetch(SYSCOM_AUTH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: syscomClientId!,
        client_secret: syscomClientSecret!,
        grant_type: "client_credentials",
      }),
    });

    if (!response.ok) {
      console.error("Error obteniendo token Syscom:", response.statusText);
      return null;
    }

    const data = await response.json();
    syscomToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in || 3600) * 1000 - 60000;
    return syscomToken;
  } catch (error) {
    console.error("Error en autenticación Syscom:", error);
    return null;
  }
}

// ============================================
// SYSCOM: OBTENER PRODUCTOS
// ============================================

interface SyscomProduct {
  producto_id: number;
  modelo: string;
  titulo: string;
  marca: string;
  img_portada?: string;
  total_existencia: number;
  precios?: {
    precio_lista?: number;
    precio_especial?: number;
    precio_descuentos?: number;
  };
}

async function getSyscomProducts(
  categoryId: string,
  page: number = 1
): Promise<{ products: SyscomProduct[]; totalPages: number }> {
  const token = await getSyscomToken();
  if (!token) return { products: [], totalPages: 0 };

  try {
    const params = new URLSearchParams({
      categoria: categoryId,
      pagina: String(page),
      cop: "true", // Precios en COP
    });

    const response = await fetch(`${SYSCOM_BASE_URL}/productos?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      console.error(`Error obteniendo productos (cat ${categoryId}):`, response.statusText);
      return { products: [], totalPages: 0 };
    }

    const data = await response.json();
    return {
      products: data.productos || [],
      totalPages: data.paginas || 1,
    };
  } catch (error) {
    console.error("Error en búsqueda Syscom:", error);
    return { products: [], totalPages: 0 };
  }
}

/**
 * Obtiene productos de una marca específica
 */
async function getSyscomProductsByBrand(
  brandId: string,
  page: number = 1
): Promise<{ products: SyscomProduct[]; totalPages: number }> {
  const token = await getSyscomToken();
  if (!token) return { products: [], totalPages: 0 };

  try {
    const params = new URLSearchParams({
      pagina: String(page),
    });

    const response = await fetch(
      `${SYSCOM_BASE_URL}/marcas/${brandId}/productos?${params}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      console.error(`Error obteniendo productos (marca ${brandId}):`, response.statusText);
      return { products: [], totalPages: 0 };
    }

    const data = await response.json();
    return {
      products: data.productos || [],
      totalPages: data.paginas || 1,
    };
  } catch (error) {
    console.error("Error en búsqueda Syscom por marca:", error);
    return { products: [], totalPages: 0 };
  }
}

// ============================================
// ALEGRA: CREAR/ACTUALIZAR ITEMS
// ============================================

async function findAlegraItemByReference(
  reference: string
): Promise<{ id: number } | null> {
  try {
    const response = await fetch(
      `${ALEGRA_API_URL}/items?reference=${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Basic ${getAlegraAuth()}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) return null;

    const items = await response.json();
    if (Array.isArray(items) && items.length > 0) {
      const found = items.find((item: { reference?: string }) => item.reference === reference);
      return found ? { id: found.id } : null;
    }
    return null;
  } catch {
    return null;
  }
}

async function syncProductToAlegra(
  product: SyscomProduct,
  categoryName: string
): Promise<{ success: boolean; action: string; error?: string }> {
  const reference = `SYSCOM-${product.producto_id}`;
  const price = product.precios?.precio_lista || product.precios?.precio_especial || 0;

  // Omitir productos sin precio
  if (price <= 0) {
    return { success: false, action: "skipped", error: "Sin precio" };
  }

  const itemData = {
    name: product.titulo || product.modelo,
    description: `${product.marca} - ${product.modelo}. Categoría: ${categoryName}. Stock Syscom: ${product.total_existencia}`,
    reference: reference,
    type: "product",
    price: [
      {
        idPriceList: 1,
        price: Math.round(price), // Redondear a entero
      },
    ],
    inventory: {
      unit: "unit",
      initialQuantity: product.total_existencia,
    },
  };

  try {
    const existing = await findAlegraItemByReference(reference);

    if (existing) {
      // Actualizar
      const response = await fetch(`${ALEGRA_API_URL}/items/${existing.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Basic ${getAlegraAuth()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { success: false, action: "error", error: errorData.message };
      }

      return { success: true, action: "updated" };
    } else {
      // Crear
      const response = await fetch(`${ALEGRA_API_URL}/items`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${getAlegraAuth()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { success: false, action: "error", error: errorData.message };
      }

      return { success: true, action: "created" };
    }
  } catch (error) {
    return {
      success: false,
      action: "error",
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

// ============================================
// SINCRONIZACIÓN PRINCIPAL
// ============================================

interface SyncStats {
  category: string;
  processed: number;
  created: number;
  updated: number;
  skipped: number;
  failed: number;
}

async function syncCategory(
  categoryId: string,
  maxProducts: number = 50
): Promise<SyncStats> {
  const categoryName = SYSCOM_CATEGORIES[categoryId] || `Categoría ${categoryId}`;
  const stats: SyncStats = {
    category: categoryName,
    processed: 0,
    created: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
  };

  console.log(`\n📦 Sincronizando: ${categoryName} (ID: ${categoryId})`);
  console.log("-".repeat(50));

  // Obtener primera página para saber total
  const { products, totalPages } = await getSyscomProducts(categoryId, 1);

  if (products.length === 0) {
    console.log("  ⚠️  No se encontraron productos");
    return stats;
  }

  console.log(`  📊 Total páginas: ${totalPages}, productos en página 1: ${products.length}`);

  // Procesar productos (limitando a maxProducts para no saturar)
  const productsToSync = products.slice(0, maxProducts);

  for (const product of productsToSync) {
    stats.processed++;
    const result = await syncProductToAlegra(product, categoryName);

    const shortName = (product.titulo || product.modelo).substring(0, 35).padEnd(35);
    if (result.success) {
      if (result.action === "created") {
        console.log(`  ✅ ${shortName} → Creado`);
        stats.created++;
      } else {
        console.log(`  🔄 ${shortName} → Actualizado`);
        stats.updated++;
      }
    } else if (result.action === "skipped") {
      console.log(`  ⏭️  ${shortName} → Omitido (${result.error})`);
      stats.skipped++;
    } else {
      console.log(`  ❌ ${shortName} → Error: ${result.error}`);
      stats.failed++;
    }

    // Pausa para respetar límite de API (60 req/min)
    await new Promise((resolve) => setTimeout(resolve, 600));
  }

  return stats;
}

/**
 * Sincroniza productos de una marca específica
 */
async function syncBrand(
  brandId: string,
  maxProducts: number = 50
): Promise<SyncStats> {
  const brandName = POPULAR_BRANDS[brandId.toLowerCase()] || brandId;
  const stats: SyncStats = {
    category: `Marca: ${brandName}`,
    processed: 0,
    created: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
  };

  console.log(`\n🏷️  Sincronizando marca: ${brandName} (ID: ${brandId})`);
  console.log("-".repeat(50));

  // Obtener productos de la marca
  const { products, totalPages } = await getSyscomProductsByBrand(brandId, 1);

  if (products.length === 0) {
    console.log("  ⚠️  No se encontraron productos para esta marca");
    return stats;
  }

  console.log(`  📊 Total páginas: ${totalPages}, productos en página 1: ${products.length}`);

  // Procesar productos
  const productsToSync = products.slice(0, maxProducts);

  for (const product of productsToSync) {
    stats.processed++;
    const result = await syncProductToAlegra(product, brandName);

    const shortName = (product.titulo || product.modelo).substring(0, 35).padEnd(35);
    if (result.success) {
      if (result.action === "created") {
        console.log(`  ✅ ${shortName} → Creado`);
        stats.created++;
      } else {
        console.log(`  🔄 ${shortName} → Actualizado`);
        stats.updated++;
      }
    } else if (result.action === "skipped") {
      console.log(`  ⏭️  ${shortName} → Omitido (${result.error})`);
      stats.skipped++;
    } else {
      console.log(`  ❌ ${shortName} → Error: ${result.error}`);
      stats.failed++;
    }

    // Pausa para respetar límite de API (60 req/min)
    await new Promise((resolve) => setTimeout(resolve, 600));
  }

  return stats;
}

/**
 * Parsea argumentos de línea de comandos
 */
function parseArgs(args: string[]): {
  category?: string;
  brand?: string;
  max: number;
  help: boolean;
} {
  const result = { max: 20, help: false } as {
    category?: string;
    brand?: string;
    max: number;
    help: boolean;
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--cat" || arg === "-c") {
      result.category = args[++i];
    } else if (arg === "--marca" || arg === "--brand" || arg === "-m") {
      result.brand = args[++i];
    } else if (arg === "--max" || arg === "-n") {
      result.max = parseInt(args[++i] || "20", 10);
    } else if (arg === "--help" || arg === "-h") {
      result.help = true;
    }
  }

  return result;
}

function showHelp() {
  console.log(`
🔄 SINCRONIZADOR SYSCOM → ALEGRA
================================

Uso: pnpm alegra:sync [opciones]

Opciones:
  --cat, -c <id>      Sincronizar solo una categoría
  --marca, -m <id>    Sincronizar solo una marca
  --max, -n <num>     Máximo de productos (default: 20)
  --help, -h          Mostrar esta ayuda

Categorías disponibles:
${Object.entries(SYSCOM_CATEGORIES).map(([id, name]) => `  ${id.padEnd(6)} → ${name}`).join("\n")}

Marcas populares:
${Object.entries(POPULAR_BRANDS).map(([id, name]) => `  ${id.padEnd(15)} → ${name}`).join("\n")}

Ejemplos:
  pnpm alegra:sync                        # Todas las categorías (20 c/u)
  pnpm alegra:sync --cat 22               # Solo Videovigilancia
  pnpm alegra:sync --marca ubiquiti       # Solo productos Ubiquiti
  pnpm alegra:sync --marca hikvision --max 50
`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    showHelp();
    process.exit(0);
  }

  console.log("🚀 SINCRONIZACIÓN SYSCOM → ALEGRA");
  console.log("=".repeat(50));
  console.log(`📧 Alegra: ${alegraEmail}`);
  console.log(`📦 Máx. productos: ${args.max}`);
  if (args.brand) console.log(`🏷️  Marca: ${args.brand}`);
  if (args.category) console.log(`📁 Categoría: ${args.category}`);

  // Verificar conexiones
  console.log("\n🔗 Verificando conexiones...");

  // Test Alegra
  try {
    const alegraTest = await fetch(`${ALEGRA_API_URL}/company`, {
      headers: {
        Authorization: `Basic ${getAlegraAuth()}`,
        "Content-Type": "application/json",
      },
    });
    if (!alegraTest.ok) throw new Error("Auth failed");
    const company = await alegraTest.json();
    console.log(`  ✅ Alegra: ${company.name}`);
  } catch {
    console.error("  ❌ Error conectando a Alegra");
    process.exit(1);
  }

  // Test Syscom
  const syscomTestToken = await getSyscomToken();
  if (!syscomTestToken) {
    console.error("  ❌ Error conectando a Syscom");
    process.exit(1);
  }
  console.log("  ✅ Syscom: Conectado");

  // Sincronizar
  const allStats: SyncStats[] = [];

  if (args.brand) {
    // Sincronizar por marca
    const stats = await syncBrand(args.brand, args.max);
    allStats.push(stats);
  } else if (args.category) {
    // Sincronizar una categoría específica
    const stats = await syncCategory(args.category, args.max);
    allStats.push(stats);
  } else {
    // Sincronizar todas las categorías
    console.log(`\n📋 Categorías a sincronizar: ${Object.keys(SYSCOM_CATEGORIES).length}`);
    for (const categoryId of Object.keys(SYSCOM_CATEGORIES)) {
      const stats = await syncCategory(categoryId, args.max);
      allStats.push(stats);
    }
  }

  // Resumen final
  console.log("\n" + "=".repeat(50));
  console.log("📊 RESUMEN FINAL");
  console.log("=".repeat(50));

  const totals = allStats.reduce(
    (acc, s) => ({
      processed: acc.processed + s.processed,
      created: acc.created + s.created,
      updated: acc.updated + s.updated,
      skipped: acc.skipped + s.skipped,
      failed: acc.failed + s.failed,
    }),
    { processed: 0, created: 0, updated: 0, skipped: 0, failed: 0 }
  );

  console.log(`\n  Procesados: ${totals.processed}`);
  console.log(`  ✅ Creados:  ${totals.created}`);
  console.log(`  🔄 Actualizados: ${totals.updated}`);
  console.log(`  ⏭️  Omitidos: ${totals.skipped}`);
  console.log(`  ❌ Fallidos: ${totals.failed}`);

  console.log("\n" + "=".repeat(50));

  if (totals.failed === 0) {
    console.log("🎉 ¡Sincronización completada exitosamente!");
  } else {
    console.log("⚠️  Sincronización completada con algunos errores.");
  }
}

main().catch(console.error);
