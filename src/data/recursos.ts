/**
 * @fileoverview Registro de utilidades gratuitas en /recursos.
 * Define cada herramienta disponible con sus metadatos y mapea
 * `slug -> componente Astro` para que la página dinámica
 * `/recursos/[slug]` sepa qué renderizar.
 *
 * Para agregar una nueva utilidad:
 *   1. Crea un componente en `src/components/recursos/<Slug>.astro`.
 *   2. Agrégalo a `componentes` con su `slug` y `Component` importado.
 *   3. Agrégalo a `recursos` con sus metadatos para que aparezca en el hub.
 *
 * @module data/recursos
 */

import PasswordGenerator from "../components/recursos/PasswordGenerator.astro";

/**
 * Tipo de un componente Astro. Usamos `typeof` del importado para
 * que TS infiera la firma exacta sin depender de tipos internos
 * que cambian entre versiones de Astro.
 */
type ComponenteAstro = typeof PasswordGenerator;

/**
 * Estado de publicación de una utilidad.
 * - `disponible`:   se puede usar y aparece listada sin marca.
 * - `proximamente`: se muestra con badge "próximamente" y deshabilitada.
 */
export type RecursoStatus = "disponible" | "proximamente";

/**
 * Paleta accent soportada por `RecursoCard`. Cada acento se mapea
 * a clases Tailwind consistentes con el resto del sitio.
 */
export type RecursoAccent =
  | "amber"
  | "blue"
  | "red"
  | "green"
  | "purple"
  | "slate";

export interface Recurso {
  /** Identificador URL-safe único. Usado en `/recursos/<slug>`. */
  slug: string;
  /** Título corto que se muestra en tarjetas y `<title>`. */
  title: string;
  /** Resumen de una línea para tarjetas y listados. */
  summary: string;
  /** Descripción larga para la página individual y la meta description. */
  description: string;
  /** Etiqueta del "step" (eyebrow) sobre el título en la página individual. */
  eyebrow: string;
  /** Categoría simple para agrupar en el hub. */
  category: "Seguridad" | "Productividad" | "Desarrollo" | "Privacidad";
  /** Acento visual para la tarjeta. */
  accent: RecursoAccent;
  /** Estado de publicación. */
  status: RecursoStatus;
  /** Etiquetas pequeñas que se muestran en la tarjeta. */
  tags: string[];
  /** Indica si la herramienta corre 100% en el cliente (sin servidor). */
  offline: boolean;
  /** Indica si la herramienta es gratuita. */
  free: boolean;
}

/**
 * Mapa de `slug -> componente Astro` que sabe renderizar la herramienta.
 * Mantener el mapa separado permite que la página dinámica no importe
 * estáticamente componentes que no se usan.
 */
export const componentes: Record<string, ComponenteAstro> = {
  "generador-contrasenas": PasswordGenerator,
};

/** Utilidades listadas en el hub `/recursos`. */
export const recursos: Recurso[] = [
  {
    slug: "generador-contrasenas",
    title: "Generador de contraseñas deterministas",
    summary:
      "Convierte unas letras base en contraseñas largas y únicas para cada servicio. Todo en tu navegador.",
    description:
      "Convierte unas letras que ya recuerdas en una contraseña larga y distinta para cada servicio. Combina tus letras base, un indicio del servicio y una clave personal con una cascada criptográfica (SHA-256 → HKDF → HMAC) que vive en tu navegador, más relleno aleatorio criptográfico real y posición variable del segmento raíz en cada clic. Sin la clave nadie reconstruye la raíz, ni siquiera conociendo tus letras base. El resultado se regenera con un clic, no se envía ni se guarda en ningún servidor.",
    eyebrow: "Una contraseña nueva en cada clic · nada se guarda",
    category: "Seguridad",
    accent: "amber",
    status: "disponible",
    tags: ["Offline", "Criptografía", "Gratis", "Sin registro"],
    offline: true,
    free: true,
  },
];

/** Devuelve un recurso por slug, o `undefined` si no existe. */
export function getRecursoBySlug(slug: string): Recurso | undefined {
  return recursos.find((r) => r.slug === slug);
}

/** Devuelve el componente que renderiza un recurso por slug, o `undefined`. */
export function getComponenteBySlug(
  slug: string,
): ComponenteAstro | undefined {
  return componentes[slug];
}

/** Solo los recursos disponibles (sin los "próximamente"). */
export const recursosDisponibles: Recurso[] = recursos.filter(
  (r) => r.status === "disponible",
);
