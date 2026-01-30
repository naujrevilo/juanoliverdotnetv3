/**
 * @fileoverview Datos de navegación del sitio - Única fuente de verdad.
 * Define todos los enlaces de navegación para header y footer.
 *
 * @module data/navigation
 * @requires ./social
 */

import type { SocialPlatform } from "./social";

/**
 * Representa un enlace de navegación individual.
 * @interface NavLink
 */
export interface NavLink {
  href: string;
  label: string;
  icon?: string;
  external?: boolean;
}

export interface NavSection {
  title: string;
  links: NavLink[];
}

// Main navigation links (header)
export const mainNavLinks: NavLink[] = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/docs", label: "Docs" },
  { href: "/blog", label: "Blog" },
  { href: "/socios", label: "Socios" },
  { href: "/tienda", label: "Tienda" },
];

// Footer navigation sections
export const footerNavSections: Record<string, NavLink[]> = {
  resources: [
    { label: "Documentación", href: "/docs" },
    { label: "Blog de informática", href: "/blog" },
    { label: "Tienda de Soluciones", href: "/tienda" },
    { label: "Guías de Hardening", href: "/docs/hardening" },
  ],
  company: [
    { label: "Sobre Mí", href: "/#about" },
    { label: "Socios & Alianzas", href: "/socios" },
    { label: "Servicios", href: "/servicios" },
    { label: "Contacto", href: "/contacto" },
  ],
  legal: [
    { label: "Política de Privacidad", href: "/privacidad" },
    { label: "Términos de Servicio", href: "/terminos" },
  ],
};

// Helper to get all footer links flat
export function getAllFooterLinks(): NavLink[] {
  return Object.values(footerNavSections).flat();
}

// Helper to check if a path is active
export function isActivePath(currentPath: string, linkPath: string): boolean {
  if (linkPath === "/") {
    return currentPath === "/";
  }
  return currentPath.startsWith(linkPath);
}
