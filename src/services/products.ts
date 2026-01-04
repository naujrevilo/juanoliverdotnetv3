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
export type Product = Omit<InferSelectModel<typeof products>, 'id'> & {
    id: number | string;
    source: 'local' | 'external';
    externalUrl?: string;
};

// Cache simple en memoria para el token (se reinicia en Serverless cold starts)
let syscomToken: string | null = null;
let tokenExpiry: number = 0;

// Cache para TRM
let currentTRM: number | null = null;
let trmExpiry: number = 0;

// Cache de Productos (Resultados de búsqueda)
const productCache = new Map<string, { data: PaginatedResult, expiry: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

const SYSCOM_BASE_URL = 'https://developers.syscomcolombia.com/api/v1';
const SYSCOM_AUTH_URL = 'https://developers.syscomcolombia.com/oauth/token';

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

    const data = await response.json();
    // Syscom suele devolver { "normal": "3773.60", ... }
    // Aseguramos parsing correcto
    const trm = parseFloat(data.normal || data.venta || "4200");

    currentTRM = trm;
    trmExpiry = Date.now() + 3600000; // Cache por 1 hora
    console.log(`TRM Actualizada: ${currentTRM}`);
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
    console.warn(
      "Faltan credenciales de Syscom (SYSCOM_CLIENT_ID, SYSCOM_CLIENT_SECRET)"
    );
    console.log("Client ID present:", !!clientId);
    console.log("Client Secret present:", !!clientSecret);
    return null;
  }

  try {
    console.log("Intentando autenticar con Syscom...");
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

    const data = await response.json();
    syscomToken = data.access_token;
    // Guardar expiración (restamos 60s por seguridad)
    tokenExpiry = Date.now() + data.expires_in * 1000 - 60000;

    console.log("Token Syscom obtenido exitosamente");
    return syscomToken;
  } catch (error) {
    console.error("Error obteniendo token Syscom:", error);
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
  options?: FilterOptions
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
          like(products.category, searchLower)
        )
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
  } catch (error) {
    console.error("Error fetching local products:", error);
    return [];
  }
}

/**
 * Obtiene los productos externos desde Syscom
 */
export async function getExternalProducts(
  options?: FilterOptions
): Promise<PaginatedResult> {
  // 1. Verificar Cache
  const cacheKey = `syscom_${JSON.stringify(options)}`;
  if (productCache.has(cacheKey)) {
    const cached = productCache.get(cacheKey)!;
    if (Date.now() < cached.expiry) {
      console.log(`[CACHE] Sirviendo resultados cacheados para: ${cacheKey}`);
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
        SYSCOM_CATEGORIES["Videovigilancia"]
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

    console.log(`Fetching Syscom URL: ${url.toString()}`);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error API Syscom: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log(
      "Respuesta Syscom recibida. Items:",
      Array.isArray(data) ? data.length : data.productos?.length || 0
    );

    // La API de Syscom devuelve un array o un objeto con 'productos'.
    const items = Array.isArray(data) ? data : data.productos || [];

    // Extraer metadatos de paginación (Syscom suele usar 'paginas' o 'total_paginas')
    // Si no viene, asumimos 1 página si hay items, o 0 si no.
    const totalPages = data.paginas || (items.length > 0 ? 1 : 0);

    const mappedItems = items.map((item: any) => {
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
    const inStockItems = mappedItems.filter((item: any) => item.stock > 0);

    const result = {
      products: inStockItems,
      totalPages: parseInt(totalPages),
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
 * Estrategia Unificada: Obtiene y mezcla ambos inventarios
 */
export async function getAllProducts(
  options?: FilterOptions
): Promise<PaginatedResult> {
  const [local, externalResult] = await Promise.all([
    getLocalProducts(options),
    getExternalProducts(options),
  ]);

  // Combinamos local (si hay) con la página actual de externos
  // Nota: Esto significa que los locales solo salen en la página 1 (manejado en getLocalProducts)
  return {
    products: [...local, ...externalResult.products],
    totalPages: externalResult.totalPages, // La paginación la dicta Syscom mayormente
    currentPage: externalResult.currentPage,
  };
}
