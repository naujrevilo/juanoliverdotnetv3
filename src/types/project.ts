/**
 * @fileoverview Tipos TypeScript para la colección de proyectos.
 * Define interfaces y tipos helper para proyectos personales.
 *
 * @module types/project
 */

import type { CollectionEntry } from "astro:content";

/**
 * Tipo inferido automáticamente desde la colección de proyectos.
 * Incluye todos los campos del frontmatter + contenido renderizado.
 */
export type Project = CollectionEntry<"projects">;

/**
 * Solo los datos del frontmatter de un proyecto.
 */
export type ProjectData = Project["data"];

/**
 * Categorías disponibles para clasificar proyectos.
 */
export type ProjectCategory =
  | "herramienta-escritorio"
  | "sitio-web"
  | "cms-blog"
  | "api"
  | "utilidad";

/**
 * Estados posibles de un proyecto.
 */
export type ProjectStatus = "público" | "beta" | "desarrollo";

/**
 * Tecnologías comunes utilizadas en los proyectos.
 * Esta lista puede expandirse según nuevos proyectos.
 */
export type Technology =
  | "Rust"
  | "Astro"
  | "Svelte"
  | "TypeScript"
  | "Tailwind CSS"
  | "TinaCMS"
  | "Turso"
  | "Drizzle ORM"
  | "egui"
  | "serde"
  | "Git"
  | "YAML"
  | "Markdown"
  | "MDX"
  | "i18n"
  | "Algolia"
  | "date-fns"
  | "Content Collections"
  | "Zod";

/**
 * Mapeo de categorías a nombres legibles en español.
 */
export const CategoryLabels: Record<ProjectCategory, string> = {
  "herramienta-escritorio": "Herramienta de Escritorio",
  "sitio-web": "Sitio Web",
  "cms-blog": "CMS / Blog",
  api: "API / Servicio",
  utilidad: "Utilidad",
};

/**
 * Mapeo de estados a nombres legibles y clases CSS.
 */
export const StatusConfig: Record<
  ProjectStatus,
  { label: string; bgClass: string; textClass: string }
> = {
  público: {
    label: "Público",
    bgClass: "bg-green-500/20",
    textClass: "text-green-700 dark:text-green-300",
  },
  beta: {
    label: "Beta",
    bgClass: "bg-yellow-500/20",
    textClass: "text-yellow-700 dark:text-yellow-300",
  },
  desarrollo: {
    label: "En Desarrollo",
    bgClass: "bg-blue-500/20",
    textClass: "text-blue-700 dark:text-blue-300",
  },
};

/**
 * Colores de tecnologías para badges (opcional).
 * Útil para visualización consistente.
 */
export const TechnologyColors: Partial<Record<Technology, string>> = {
  Rust: "bg-orange-500/20 text-orange-700 dark:text-orange-300",
  Astro: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  Svelte: "bg-red-500/20 text-red-700 dark:text-red-300",
  TypeScript: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  "Tailwind CSS": "bg-cyan-500/20 text-cyan-700 dark:text-cyan-300",
};
