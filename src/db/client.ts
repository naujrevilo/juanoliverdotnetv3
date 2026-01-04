/**
 * @fileoverview Cliente de conexión a Turso (Edge SQL) usando Drizzle ORM.
 * Configura la conexión a la base de datos con soporte para entornos
 * Vite/Astro y Node.js.
 *
 * @module db/client
 * @requires @libsql/client
 * @requires drizzle-orm/libsql
 *
 * @example
 * // Uso en un componente Astro o servicio
 * import { db } from '../db/client';
 * import { products } from '../db/schema';
 *
 * const allProducts = await db.select().from(products);
 */

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

/**
 * Obtiene variables de entorno de forma segura en múltiples entornos.
 * Soporta Vite/Astro (import.meta.env) y Node.js (process.env).
 *
 * @param {string} key - Nombre de la variable de entorno
 * @returns {string | undefined} Valor de la variable o undefined si no existe
 * @private
 */
const getEnv = (key: string): string | undefined => {
  // Check for Astro/Vite environment
  // @ts-ignore
  if (
    typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env[key]
  ) {
    // @ts-ignore
    return import.meta.env[key];
  }
  // Check for Node environment
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    return process.env[key];
  }
  return undefined;
};

const url = getEnv("TURSO_DATABASE_URL") || "file:local.db";
const authToken = getEnv("TURSO_AUTH_TOKEN");

const client = createClient({
  url,
  authToken,
});

export const db = drizzle(client, { schema });
