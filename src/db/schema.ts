/**
 * @fileoverview Esquema de base de datos para Turso/SQLite usando Drizzle ORM.
 * Define las tablas principales del sistema: productos y socios.
 *
 * @module db/schema
 * @requires drizzle-orm/sqlite-core
 * @see {@link https://orm.drizzle.team/docs/sql-schema-declaration Drizzle Schema Docs}
 */

import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

/**
 * Tabla de productos para la tienda.
 * Almacena productos locales (no los de Syscom que vienen por API).
 *
 * @table products
 * @property {number} id - ID autoincremental único
 * @property {string} name - Nombre del producto (requerido)
 * @property {string} description - Descripción detallada (requerido)
 * @property {number} price - Precio en COP (requerido)
 * @property {number} stock - Cantidad disponible (default: 0)
 * @property {string} [brand] - Marca del producto (ej: 'Ubiquiti', 'Microsoft')
 * @property {string} [model] - Modelo específico del producto
 * @property {string} category - Categoría: 'hardware', 'software', 'service'
 * @property {string} [imageUrl] - URL de la imagen del producto
 * @property {string} slug - Identificador único para URLs (único)
 * @property {Date} createdAt - Fecha de creación automática
 */
export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  stock: integer("stock").notNull().default(0),
  brand: text("brand"), // Marca del producto (e.g. 'Ubiquiti', 'Microsoft')
  model: text("model"), // Modelo específico
  category: text("category").notNull(), // 'hardware', 'software', 'service'
  imageUrl: text("image_url"),
  slug: text("slug").unique().notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

/**
 * Tabla de socios/partners para alianzas estratégicas.
 * Muestra los logos y enlaces de empresas asociadas.
 *
 * @table partners
 * @property {number} id - ID autoincremental único
 * @property {string} name - Nombre del socio (requerido)
 * @property {string} logoUrl - URL del logo del socio (requerido)
 * @property {string} [websiteUrl] - URL del sitio web del socio
 * @property {string} [description] - Descripción breve del socio
 * @property {string} [category] - Categoría: 'security', 'cloud', 'software'
 */
export const partners = sqliteTable("partners", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  logoUrl: text("logo_url").notNull(),
  websiteUrl: text("website_url"),
  description: text("description"),
  category: text("category"), // 'security', 'cloud', 'software'
});
