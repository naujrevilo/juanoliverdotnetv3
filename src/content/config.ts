/**
 * @fileoverview Configuración de colecciones de contenido para Astro.
 * Define los esquemas de validación para blog y documentación.
 *
 * @module content/config
 * @requires astro:content
 * @requires @astrojs/starlight/schema
 * @see {@link https://docs.astro.build/en/guides/content-collections/ Astro Content Collections}
 */

import { defineCollection, z } from "astro:content";
import { docsSchema } from "@astrojs/starlight/schema";

/**
 * Colección de artículos del blog.
 * Cada archivo .md/.mdx en src/content/blog/ debe cumplir este esquema.
 *
 * @collection blog
 * @property {string} title - Título del artículo (requerido)
 * @property {string} description - Descripción para SEO (requerido)
 * @property {Date} date - Fecha de publicación (requerido)
 * @property {string[]} categories - Categorías del artículo (requerido)
 * @property {string[]} [tags] - Etiquetas opcionales
 * @property {string} [image] - Imagen destacada del artículo
 * @property {boolean} [showToc] - Mostrar tabla de contenidos (default: false)
 */
const blogCollection = defineCollection({
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.date(),
      categories: z.array(
        z.enum([
          "ciberseguridad",
          "pentesting",
          "automatización",
          "tutoriales",
          "hobbies",
          "informática",
          "seguridad",
        ]),
      ), // Lista fija de categorías
      tags: z.array(z.string()).optional(),
      author: z.string().default("Juan Oliver"),
      image: image().optional(),
      socialImage: image().optional(),
      showToc: z.boolean().optional().default(false),
      draft: z.boolean().default(false),
    }),
});

/**
 * Exportación de todas las colecciones de contenido.
 * Astro usa esto para validar y tipar el contenido automáticamente.
 *
 * @exports collections
 * @property {Collection} docs - Documentación técnica (Starlight)
 * @property {Collection} blog - Artículos del blog
 */
export const collections = {
  docs: defineCollection({
    schema: docsSchema({
      extend: z.object({
        date: z.date(),
        categories: z.array(z.string()),
        tags: z.array(z.string()).optional(),
        draft: z.boolean().optional().default(false),
        hero: z.any().optional(), // Permitir hero opcionalmente y relajar su tipo para evitar conflictos
      }),
    }),
  }),
  blog: blogCollection,
};
