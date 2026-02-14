/**
 * @fileoverview Servicio de productos - Integración local + Syscom API.
 * Gestiona el inventario híbrido: productos locales (Turso) y externos (Syscom).
 * Incluye caché en memoria, conversión de moneda (TRM) y paginación.
 *
 * @module services/products
 * @requires ../db/client
 * @requires ../db/schema
 * @requires drizzle-orm
 *
 * @example
 * // Obtener todos los productos con filtros
 * const result = await getAllProducts({ search: 'ubiquiti', page: 1 });
 * console.log(result.products, result.totalPages);
 */

import { db } from "../db/client";
import { products } from "../db/schema";
import { like, or } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";

/**
 * Tipo extendido de producto que incluye origen (local o externo).
 * Extiende el modelo base de la tabla products.
 */
export type Product = Omit<InferSelectModel<typeof products>, "id"> & {
  id: number | string;
  source: "local" | "external";
  externalUrl?: string;
};

/**
 * Tipos de respuesta de la API de Syscom Colombia.
 */
interface SyscomCategory {
  nombre: string;
}

interface SyscomPrecios {
  precio_lista?: string;
}

interface SyscomProduct {
  producto_id: string | number;
  titulo: string;
  descripcion?: string;
  marca?: string;
  modelo?: string;
  precios?: SyscomPrecios;
  total_existencia?: string;
  categorias?: SyscomCategory[];
  img_portada?: string;
  link?: string;
}

interface SyscomProductsResponse {
  productos?: SyscomProduct[];
  paginas?: string | number;
}

interface SyscomAuthResponse {
  access_token: string;
  expires_in: number;
}

interface SyscomTRMResponse {
  normal?: string;
  venta?: string;
}

// Cache simple en memoria para el token (se reinicia en Serverless cold starts)
let syscomToken: string | null = null;
let tokenExpiry: number = 0;

// Cache para TRM
let currentTRM: number | null = null;
let trmExpiry: number = 0;

// Cache de Productos (Resultados de búsqueda)
const productCache = new Map<
  string,
  { data: PaginatedResult; expiry: number }
>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

const SYSCOM_BASE_URL = "https://developers.syscomcolombia.com/api/v1";
const SYSCOM_AUTH_URL = "https://developers.syscomcolombia.com/oauth/token";

/**
 * Obtiene la TRM (Tasa de Cambio) actual desde Syscom
 */
async function getExchangeRate(): Promise<number> {
  if (currentTRM && Date.now() < trmExpiry) {
    return currentTRM;
  }

  const token = await getSyscomToken();
  if (!token) return 4200; // Fallback seguro si falla auth

  try {
    const response = await fetch(`${SYSCOM_BASE_URL}/tipocambio`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Error fetching TRM");

    const data: SyscomTRMResponse = await response.json();
    // Syscom suele devolver { "normal": "3773.60", ... }
    // Aseguramos parsing correcto
    const trm = parseFloat(data.normal || data.venta || "4200");

    currentTRM = trm;
    trmExpiry = Date.now() + 3600000; // Cache por 1 hora
    return currentTRM;
  } catch (error) {
    console.error("Error obteniendo TRM:", error);
    return currentTRM || 4200; // Fallback
  }
}

// Mapeo de categorías conocidas a IDs de Syscom
const SYSCOM_CATEGORIES: Record<string, string> = {
  Videovigilancia: "22",
  Redes: "26",
  "Control de Acceso": "37",
  Energía: "30",
  "Automatización e Intrusión": "32",
  "Detección de Fuego": "38",
  "Cableado Estructurado": "65811",
};

/**
 * Obtiene el token de acceso de Syscom
 */
async function getSyscomToken(): Promise<string | null> {
  // Verificar si tenemos un token válido
  if (syscomToken && Date.now() < tokenExpiry) {
    return syscomToken;
  }

  const clientId =
    import.meta.env?.SYSCOM_CLIENT_ID || process.env.SYSCOM_CLIENT_ID;
  const clientSecret =
    import.meta.env?.SYSCOM_CLIENT_SECRET || process.env.SYSCOM_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return null;
  }

  try {
    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);
    params.append("grant_type", "client_credentials");

    const response = await fetch(SYSCOM_AUTH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    if (!response.ok) {
      throw new Error(`Error auth Syscom: ${response.statusText}`);
    }

    const data: SyscomAuthResponse = await response.json();
    syscomToken = data.access_token;
    // Guardar expiración (restamos 60s por seguridad)
    tokenExpiry = Date.now() + data.expires_in * 1000 - 60000;

    return syscomToken;
  } catch (error) {
    return null;
  }
}

interface FilterOptions {
  search?: string;
  category?: string;
  page?: number;
}

export interface PaginatedResult {
  products: Product[];
  totalPages: number;
  currentPage: number;
}

/**
 * Obtiene los productos locales desde Turso
 */
export async function getLocalProducts(
  options?: FilterOptions,
): Promise<Product[]> {
  // Si estamos en página > 1, asumimos que no hay más productos locales (por simplicidad)
  if (options?.page && options.page > 1) return [];

  try {
    let query = db.select().from(products).$dynamic();

    if (options?.search) {
      const searchLower = `%${options.search.toLowerCase()}%`;
      // Note: SQLite LIKE is case-insensitive for ASCII characters by default
      query = query.where(
        or(
          like(products.name, searchLower),
          like(products.description, searchLower),
          like(products.category, searchLower),
        ),
      );
    }

    if (options?.category) {
      query = query.where(like(products.category, `%${options.category}%`));
    }

    const local = await query;
    return local.map((p) => ({
      ...p,
      source: "local",
    }));
  } catch (error: unknown) {
    // Si la tabla no existe o hay otro error de BD, retornamos array vacío
    // para no romper la página si la integración está desactivada.
    const err = error as { message?: string; code?: string };
    if (
      err?.message?.includes("no such table") ||
      err?.code === "SQLITE_ERROR"
    ) {
      console.warn("Tabla de productos no encontrada, retornando lista vacía.");
    } else {
      console.error("Error fetching local products:", error);
    }
    return [];
  }
}

/**
 * Obtiene los productos externos desde Syscom
 */
export async function getExternalProducts(
  options?: FilterOptions,
): Promise<PaginatedResult> {
  // 1. Verificar Cache
  const cacheKey = `syscom_${JSON.stringify(options)}`;
  if (productCache.has(cacheKey)) {
    const cached = productCache.get(cacheKey)!;
    if (Date.now() < cached.expiry) {
      return cached.data;
    }
    productCache.delete(cacheKey);
  }

  const token = await getSyscomToken();
  const trm = await getExchangeRate();

  if (!token) return { products: [], totalPages: 0, currentPage: 1 };

  try {
    const url = new URL(`${SYSCOM_BASE_URL}/productos`);

    // Paginación
    const page = options?.page || 1;
    url.searchParams.append("pagina", page.toString());

    // Filtro de Existencia (Intentar filtrar desde API si es posible, aunque Syscom a veces ignora esto)
    // Nota: 'stock' o 'existencia' no siempre son parámetros estándar documentados públicos,
    // pero filtramos en cliente para asegurar cumplimiento de regla de negocio.

    // Lógica de Filtros para Syscom
    const hasSearch = !!options?.search;
    const hasCategory = !!options?.category;

    if (!hasSearch && !hasCategory) {
      // Default: Cargar categoría 'Videovigilancia' (ID 22) para tener productos en portada
      url.searchParams.append(
        "categoria",
        SYSCOM_CATEGORIES["Videovigilancia"],
      );
    } else {
      // Manejo de Búsqueda
      if (hasSearch && options.search) {
        url.searchParams.append("busqueda", options.search);
      }

      // Manejo de Categoría
      if (hasCategory && options.category) {
        const catId = SYSCOM_CATEGORIES[options.category];
        if (catId) {
          // Si tenemos ID mapeado, usamos el filtro estricto de categoría
          url.searchParams.append("categoria", catId);
        } else {
          // Si no hay ID (ej. 'Software'), lo agregamos a la búsqueda
          // Esto permite filtrar por términos generales aunque no sean categorías oficiales de Syscom
          if (!url.searchParams.has("busqueda")) {
            url.searchParams.append("busqueda", options.category);
          }
        }
      }
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error API Syscom: ${response.status} - ${errorText}`);
    }

    const data: SyscomProduct[] | SyscomProductsResponse =
      await response.json();

    // La API de Syscom devuelve un array o un objeto con 'productos'.
    const items: SyscomProduct[] = Array.isArray(data)
      ? data
      : (data as SyscomProductsResponse).productos || [];

    // Extraer metadatos de paginación (Syscom suele usar 'paginas' o 'total_paginas')
    // Si no viene, asumimos 1 página si hay items, o 0 si no.
    const rawPages = !Array.isArray(data)
      ? (data as SyscomProductsResponse).paginas
      : undefined;
    const totalPages = rawPages ? Number(rawPages) : items.length > 0 ? 1 : 0;

    const mappedItems: Product[] = items.map((item) => {
      // Cálculo de precio en COP con IVA
      const priceUSD = parseFloat(item.precios?.precio_lista || "0");
      const priceCOP = priceUSD * trm;
      const priceWithIVA = priceCOP * 1.19; // 19% IVA

      return {
        id: `sys_${item.producto_id}`,
        name: item.titulo,
        description: item.descripcion || "Sin descripción",
        brand: item.marca || "Syscom",
        model: item.modelo || "",
        price: Math.round(priceWithIVA), // Redondear a entero
        stock: parseInt(item.total_existencia || "0"),
        category: item.categorias?.[0]?.nombre || "External",
        slug: `sys-${item.producto_id}`,
        imageUrl: item.img_portada || null,
        createdAt: new Date(),
        source: "external",
        externalUrl: item.link
          ? `https://www.syscomcolombia.com${item.link}`
          : undefined,
      };
    });

    // Filtrar solo productos con existencia > 0
    const inStockItems = mappedItems.filter((item) => item.stock > 0);

    const result = {
      products: inStockItems,
      totalPages,
      currentPage: options?.page || 1,
    };

    // Guardar en Cache
    productCache.set(cacheKey, {
      data: result,
      expiry: Date.now() + CACHE_TTL,
    });

    return result;
  } catch (error) {
    console.error("Error fetching external products:", error);
    return { products: [], totalPages: 0, currentPage: 1 };
  }
}

/**
 * Verifica si la integración con Syscom está habilitada vía feature flag.
 */
function isSyscomEnabled(): boolean {
  const flag =
    import.meta.env?.ENABLE_SYSCOM || process.env.ENABLE_SYSCOM || "false";
  return flag === "true";
}

/**
 * Estrategia Unificada: Obtiene y mezcla ambos inventarios.
 * La integración con Syscom se controla con la variable ENABLE_SYSCOM.
 */
export async function getAllProducts(
  options?: FilterOptions,
): Promise<PaginatedResult> {
  const local = await getLocalProducts(options);

  if (!isSyscomEnabled()) {
    return {
      products: local,
      totalPages: local.length > 0 ? 1 : 0,
      currentPage: options?.page || 1,
    };
  }

  // Syscom habilitado: mezclar inventarios
  const external = await getExternalProducts(options);
  const allProducts = [...local, ...external.products];

  return {
    products: allProducts,
    totalPages: Math.max(local.length > 0 ? 1 : 0, external.totalPages),
    currentPage: options?.page || 1,
  };
}

// =============================================================================
// COTIZACIONES - Sistema A/B Testing (Variante B)
// =============================================================================

/**
 * Item del carrito para generar cotización
 */
export interface QuoteItem {
  producto_id: string;
  cantidad: number;
}

/**
 * Respuesta de la API de cotización de Syscom
 */
export interface QuoteResponse {
  success: boolean;
  folio?: string;
  total?: number;
  productos?: Array<{
    producto_id: string;
    cantidad: number;
    precio_unitario: number;
    precio_total: number;
  }>;
  error?: string;
}

/**
 * Genera una cotización en Syscom sin ordenar.
 * Usa el endpoint /carrito/generar con ordenar: false.
 *
 * @param items - Array de items con producto_id y cantidad
 * @returns Respuesta con folio de cotización y detalles
 *
 * @example
 * const quote = await generateSyscomQuote([
 *   { producto_id: "12345", cantidad: 2 },
 *   { producto_id: "67890", cantidad: 1 }
 * ]);
 */
export async function generateSyscomQuote(
  items: QuoteItem[],
): Promise<QuoteResponse> {
  const token = await getSyscomToken();

  if (!token) {
    return {
      success: false,
      error: "No se pudo autenticar con Syscom",
    };
  }

  // Validar que hay items
  if (!items || items.length === 0) {
    return {
      success: false,
      error: "El carrito está vacío",
    };
  }

  try {
    // Construir payload para Syscom
    // El formato esperado: { productos: [...], ordenar: false }
    const payload = {
      productos: items.map((item) => ({
        producto_id: item.producto_id.replace("sys_", ""), // Quitar prefijo si existe
        cantidad: item.cantidad,
      })),
      ordenar: false, // Solo cotización, no orden de compra
    };

    const response = await fetch(`${SYSCOM_BASE_URL}/carrito/generar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Error de Syscom: ${response.status}`,
      };
    }

    const data = await response.json();

    // Syscom devuelve información del carrito/cotización
    return {
      success: true,
      folio: data.folio || data.cotizacion_id || "PENDING",
      total: data.total || 0,
      productos: data.productos || [],
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Valida si un producto de Syscom tiene stock disponible.
 * Útil para verificar disponibilidad antes de cotizar.
 *
 * @param productId - ID del producto en Syscom (sin prefijo sys_)
 * @returns Objeto con disponibilidad y stock actual
 */
export async function checkProductStock(
  productId: string,
): Promise<{ available: boolean; stock: number }> {
  const token = await getSyscomToken();

  if (!token) {
    return { available: false, stock: 0 };
  }

  try {
    const cleanId = productId.replace("sys_", "");
    const response = await fetch(`${SYSCOM_BASE_URL}/productos/${cleanId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return { available: false, stock: 0 };
    }

    const data = await response.json();
    const stock = parseInt(data.total_existencia || "0");

    return {
      available: stock > 0,
      stock,
    };
  } catch (error) {
    console.error("Error checking stock:", error);
    return { available: false, stock: 0 };
  }
}
