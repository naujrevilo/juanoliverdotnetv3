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
          "software",
          "desarrollo",
          "herramientas",
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
 * Colección de proyectos personales.
 * Cada archivo .md/.mdx en src/content/projects/ describe un proyecto desarrollado.
 *
 * @collection projects
 * @property {string} title - Nombre del proyecto (requerido)
 * @property {string} description - Descripción breve para SEO (requerido)
 * @property {string} longDescription - Descripción extendida (requerido)
 * @property {Date} publishDate - Fecha de publicación del proyecto (requerido)
 * @property {string[]} technologies - Tecnologías utilizadas (requerido)
 * @property {string} category - Categoría del proyecto (requerido)
 * @property {string} status - Estado: público, beta, desarrollo (requerido)
 * @property {string} [demoUrl] - URL de la demo o proyecto desplegado
 * @property {string} repoUrl - URL del repositorio de GitHub (requerido)
 * @property {string} [image] - Path a la imagen del proyecto
 * @property {boolean} [featured] - Proyecto destacado (default: false)
 */
const projectsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    longDescription: z.string(),
    publishDate: z.date(),
    technologies: z.array(z.string()),
    category: z.enum([
      "herramienta-escritorio",
      "sitio-web",
      "cms-blog",
      "api",
      "utilidad",
    ]),
    status: z.enum(["público", "beta", "desarrollo"]),
    demoUrl: z.string().url().optional(),
    repoUrl: z.string().url(),
    image: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

/**
 * Colección de landings evergreen de aplicaciones.
 * Cada archivo .md/.mdx en src/content/app-landings/ describe una app
 * desde una perspectiva de producto (sin versionado específico).
 *
 * @collection app-landings
 * @property {string} title - Nombre de la aplicación (requerido)
 * @property {string} description - Descripción breve para SEO (requerido)
 * @property {string} longDescription - Descripción extendida (requerido)
 * @property {string[]} technologies - Tecnologías principales (requerido)
 * @property {string} status - Estado editorial de la app (requerido)
 * @property {string} primaryCtaLabel - Texto del CTA principal (requerido)
 * @property {string} primaryCtaUrl - URL del CTA principal (requerido)
 * @property {string} repoUrl - URL del repositorio oficial (requerido)
 * @property {string} [secondaryCtaLabel] - Texto del CTA secundario
 * @property {string} [secondaryCtaUrl] - URL del CTA secundario
 * @property {string} [image] - Path de imagen hero de la app
 * @property {string} [pathSlug] - Slug público opcional para rutas (si difiere del filename)
 */
const appLandingsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    longDescription: z.string(),
    technologies: z.array(z.string()).min(1),
    status: z.enum(["disponible", "beta", "próximamente"]),
    primaryCtaLabel: z.string(),
    primaryCtaUrl: z.string(),
    secondaryCtaLabel: z.string().optional(),
    secondaryCtaUrl: z.string().optional(),
    repoUrl: z.string().url(),
    image: z.string().optional(),
    pathSlug: z.string().optional(),
  }),
});

/**
 * Exportación de todas las colecciones de contenido.
 * Astro usa esto para validar y tipar el contenido automáticamente.
 *
 * @exports collections
 * @property {Collection} docs - Documentación técnica (Starlight)
 * @property {Collection} blog - Artículos del blog
 * @property {Collection} projects - Proyectos personales
 */
export const collections = {
  docs: defineCollection({
    schema: docsSchema({
      extend: z.object({
        date: z.date(),
        categories: z.array(z.string()),
        tags: z.array(z.string()).optional(),
        draft: z.boolean().optional().default(false),
      }),
    }),
  }),
  blog: blogCollection,
  projects: projectsCollection,
  "app-landings": appLandingsCollection,
};
