/**
 * @fileoverview Datos y utilidades de socios/partners.
 * Gestiona la información de alianzas estratégicas mostradas en /socios.
 *
 * @module data/partners
 * @requires ./partners.json
 */

import partnersData from "./partners.json";

/**
 * Colores disponibles para destacar socios en la UI.
 * @typedef {('blue'|'green'|'cyan'|'red'|'yellow'|'purple')} PartnerColor
 */
export type PartnerColor =
  | "blue"
  | "green"
  | "cyan"
  | "red"
  | "yellow"
  | "purple";

export interface Partner {
  id: string;
  name: string;
  category: string;
  description: string;
  logo: string;
  website: string;
  color: PartnerColor;
  featured: boolean;
}

// Export partners from JSON
export const partners: Partner[] = partnersData.partners as Partner[];

// Get featured partners only
export function getFeaturedPartners(): Partner[] {
  return partners.filter((p) => p.featured);
}

// Get partners by category
export function getPartnersByCategory(category: string): Partner[] {
  return partners.filter((p) => p.category === category);
}

// Get unique categories
export function getPartnerCategories(): string[] {
  return [...new Set(partners.map((p) => p.category))];
}

// Get partner by ID
export function getPartnerById(id: string): Partner | undefined {
  return partners.find((p) => p.id === id);
}
