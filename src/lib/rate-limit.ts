/**
 * @fileoverview Rate limiter en memoria para endpoints API.
 * Implementa ventana deslizante por IP con limpieza automática.
 *
 * @note En entornos serverless (Netlify Functions, AWS Lambda) el store en memoria
 * se reinicia en cada cold start, limitando la efectividad. Para rate limiting
 * persistente en producción serverless, considerar Upstash Redis o edge middleware.
 * La implementación actual es efectiva con Astro SSR en modo servidor (Node adapter).
 *
 * @module lib/rate-limit
 *
 * @example
 * import { rateLimit, createRateLimitResponse } from '../lib/rate-limit';
 *
 * export const POST: APIRoute = async ({ request }) => {
 *   const limited = rateLimit(request, { maxRequests: 10, windowMs: 60_000 });
 *   if (limited) return createRateLimitResponse();
 *   // ... handler normal
 * };
 */

interface RateLimitEntry {
  timestamps: number[];
}

interface RateLimitOptions {
  /** Máximo de requests permitidos en la ventana */
  maxRequests: number;
  /** Duración de la ventana en milisegundos */
  windowMs: number;
}

const store = new Map<string, RateLimitEntry>();

// Limpieza periódica de entradas expiradas (cada 5 minutos)
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup(windowMs: number): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, entry] of store) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);
    if (entry.timestamps.length === 0) {
      store.delete(key);
    }
  }
}

/**
 * Extrae la IP del request (soporta headers de proxy comunes).
 */
function getClientIP(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

/**
 * Verifica si un request excede el rate limit.
 * @returns true si el request debe ser bloqueado, false si está permitido.
 */
export function rateLimit(
  request: Request,
  options: RateLimitOptions = { maxRequests: 20, windowMs: 60_000 },
): boolean {
  const { maxRequests, windowMs } = options;
  const ip = getClientIP(request);
  const now = Date.now();

  cleanup(windowMs);

  const entry = store.get(ip) || { timestamps: [] };
  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);
  entry.timestamps.push(now);
  store.set(ip, entry);

  return entry.timestamps.length > maxRequests;
}

/**
 * Crea una respuesta 429 Too Many Requests estándar.
 */
export function createRateLimitResponse(): Response {
  return new Response(
    JSON.stringify({
      success: false,
      message: "Demasiadas solicitudes. Intenta de nuevo más tarde.",
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": "60",
      },
    },
  );
}
