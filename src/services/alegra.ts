/**
 * @fileoverview Servicio de integración con Alegra API.
 * Gestiona autenticación, ítems (productos/servicios) y cotizaciones.
 *
 * @module services/alegra
 * @see https://developer.alegra.com/reference
 *
 * @example
 * // Crear un ítem en Alegra
 * const item = await createAlegraItem({
 *   name: "Auditoría de Seguridad",
 *   price: 5500000,
 *   type: "service"
 * });
 */

// URL de la API - Sandbox: https://sandbox.alegra.com:26967/api/v1
// Producción: https://api.alegra.com/api/v1
const ALEGRA_API_URL = import.meta.env.ALEGRA_API_URL || process.env.ALEGRA_API_URL || "https://api.alegra.com/api/v1";

/**
 * Obtiene las credenciales de Alegra codificadas en Base64
 */
function getAlegraAuth(): string {
  const email = import.meta.env.ALEGRA_EMAIL || process.env.ALEGRA_EMAIL;
  const token = import.meta.env.ALEGRA_TOKEN || process.env.ALEGRA_TOKEN;

  if (!email || !token) {
    throw new Error(
      "Credenciales de Alegra no configuradas. Revisa ALEGRA_EMAIL y ALEGRA_TOKEN"
    );
  }

  // Base64 encode de email:token
  const credentials = `${email}:${token}`;
  if (typeof Buffer !== "undefined") {
    return Buffer.from(credentials).toString("base64");
  }
  return btoa(credentials);
}

/**
 * Headers comunes para requests a Alegra
 */
function getHeaders(): HeadersInit {
  return {
    Authorization: `Basic ${getAlegraAuth()}`,
    "Content-Type": "application/json",
  };
}

// ============================================
// TIPOS
// ============================================

export interface AlegraItem {
  id?: number;
  name: string;
  description?: string;
  reference?: string; // Código/SKU del producto
  type?: "product" | "service";
  price?: number | AlegraPrice[];
  tax?: { id: number }[];
  inventory?: {
    unit?: string;
    unitCost?: number;
    initialQuantity?: number;
    availableQuantity?: number;
  };
  category?: { id: number };
  itemCategory?: { id: number };
}

export interface AlegraPrice {
  idPriceList: number;
  price: number;
}

export interface AlegraContact {
  id?: number;
  name: string;
  identification?: string;
  email?: string;
  phonePrimary?: string;
  address?: {
    address?: string;
    city?: string;
  };
  type?: ("client" | "provider")[];
}

export interface AlegraEstimateItem {
  id?: number; // ID del ítem en Alegra (si existe)
  name?: string; // Nombre si no existe el ítem
  description?: string;
  price: number;
  quantity: number;
  tax?: { id: number }[];
}

export interface AlegraEstimate {
  id?: number;
  date: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  client: { id: number } | AlegraContact;
  items: AlegraEstimateItem[];
  observations?: string;
  termsConditions?: string;
  status?: "open" | "accepted" | "rejected" | "invoiced";
}

export interface AlegraApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: number;
}

// ============================================
// ÍTEMS (Productos/Servicios)
// ============================================

/**
 * Lista todos los ítems de Alegra
 */
export async function listAlegraItems(params?: {
  start?: number;
  limit?: number;
  type?: "product" | "service";
  query?: string;
}): Promise<AlegraApiResponse<AlegraItem[]>> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.start) searchParams.set("start", String(params.start));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.type) searchParams.set("type", params.type);
    if (params?.query) searchParams.set("query", params.query);

    const url = `${ALEGRA_API_URL}/items${searchParams.toString() ? `?${searchParams}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || `Error ${response.status}`,
        code: response.status,
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Obtiene un ítem por ID
 */
export async function getAlegraItem(
  id: number
): Promise<AlegraApiResponse<AlegraItem>> {
  try {
    const response = await fetch(`${ALEGRA_API_URL}/items/${id}`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || `Error ${response.status}`,
        code: response.status,
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Busca un ítem por referencia (código/SKU)
 */
export async function findAlegraItemByReference(
  reference: string
): Promise<AlegraApiResponse<AlegraItem | null>> {
  try {
    const response = await fetch(
      `${ALEGRA_API_URL}/items?reference=${encodeURIComponent(reference)}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || `Error ${response.status}`,
        code: response.status,
      };
    }

    const items = await response.json();
    // La API devuelve array, buscamos el que coincida exactamente
    const found = Array.isArray(items)
      ? items.find((item: AlegraItem) => item.reference === reference)
      : null;

    return { success: true, data: found || null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Crea un nuevo ítem en Alegra
 */
export async function createAlegraItem(
  item: AlegraItem
): Promise<AlegraApiResponse<AlegraItem>> {
  try {
    const response = await fetch(`${ALEGRA_API_URL}/items`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || `Error ${response.status}`,
        code: response.status,
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Actualiza un ítem existente en Alegra
 */
export async function updateAlegraItem(
  id: number,
  item: Partial<AlegraItem>
): Promise<AlegraApiResponse<AlegraItem>> {
  try {
    const response = await fetch(`${ALEGRA_API_URL}/items/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || `Error ${response.status}`,
        code: response.status,
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

// ============================================
// CONTACTOS
// ============================================

/**
 * Busca un contacto por email
 */
export async function findAlegraContactByEmail(
  email: string
): Promise<AlegraApiResponse<AlegraContact | null>> {
  try {
    const response = await fetch(
      `${ALEGRA_API_URL}/contacts?query=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || `Error ${response.status}`,
        code: response.status,
      };
    }

    const contacts = await response.json();
    const found = Array.isArray(contacts)
      ? contacts.find((c: AlegraContact) => c.email === email)
      : null;

    return { success: true, data: found || null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Crea un nuevo contacto en Alegra
 */
export async function createAlegraContact(
  contact: AlegraContact
): Promise<AlegraApiResponse<AlegraContact>> {
  try {
    const response = await fetch(`${ALEGRA_API_URL}/contacts`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        ...contact,
        type: contact.type || ["client"],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || `Error ${response.status}`,
        code: response.status,
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

// ============================================
// COTIZACIONES (Estimates)
// ============================================

/**
 * Crea una cotización en Alegra
 */
export async function createAlegraEstimate(
  estimate: AlegraEstimate
): Promise<AlegraApiResponse<AlegraEstimate & { id: number }>> {
  try {
    const response = await fetch(`${ALEGRA_API_URL}/estimates`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(estimate),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || `Error ${response.status}`,
        code: response.status,
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Lista cotizaciones de Alegra
 */
export async function listAlegraEstimates(params?: {
  start?: number;
  limit?: number;
  status?: "open" | "accepted" | "rejected" | "invoiced";
}): Promise<AlegraApiResponse<AlegraEstimate[]>> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.start) searchParams.set("start", String(params.start));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.status) searchParams.set("status", params.status);

    const url = `${ALEGRA_API_URL}/estimates${searchParams.toString() ? `?${searchParams}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || `Error ${response.status}`,
        code: response.status,
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

// ============================================
// UTILIDADES
// ============================================

/**
 * Verifica la conexión con Alegra
 */
export async function testAlegraConnection(): Promise<AlegraApiResponse<boolean>> {
  try {
    const response = await fetch(`${ALEGRA_API_URL}/company`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || `Error ${response.status}`,
        code: response.status,
      };
    }

    return { success: true, data: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Formatea fecha para Alegra (YYYY-MM-DD)
 */
export function formatAlegraDate(date: Date = new Date()): string {
  return date.toISOString().split("T")[0];
}

/**
 * Calcula fecha de vencimiento (30 días por defecto)
 */
export function calculateDueDate(daysFromNow: number = 30): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return formatAlegraDate(date);
}
