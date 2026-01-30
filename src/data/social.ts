// Eliminado export duplicado de author para evitar conflicto
/**
 * @fileoverview Datos y utilidades de redes sociales.
 * Gestiona los enlaces sociales, iconos SVG y estilos de hover.
 *
 * @module data/social
 * @requires ./social.json
 */

import socialData from "./social.json";

/**
 * Plataformas de redes sociales soportadas.
 * @typedef {('linkedin'|'github'|'twitter'|'youtube'|'instagram'|'email')} SocialPlatform
 */
export type SocialPlatform =
  | "linkedin"
  | "github"
  | "twitter"
  | "youtube"
  | "instagram"
  | "email"
  | "paypal"
  | "buymeacoffee";

export interface SocialNetwork {
  platform: SocialPlatform;
  label: string;
  href: string;
  username: string;
}

export interface AuthorInfo {
  name: string;
  initials: string;
  role: string;
  email: string;
  bio: string;
}

// Social icons SVG paths (stroke-based)
export const socialIcons: Record<SocialPlatform, string> = {
  linkedin: `<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle>`,
  github: `<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>`,
  twitter: `<path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>`,
  youtube: `<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>`,
  instagram: `<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>`,
  email: `<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>`,
  paypal: `<path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.946 5.05-4.336 6.795-9.116 6.795H8.913a.64.64 0 0 0-.633.528l-1.204 7.48z"></path>`,
  buymeacoffee: `<path d="M20.216 6.415l-.132-.666c-.11-.544-.465-1-1.003-1.324-1.88-.888-9.532-4.696-14.746-2.583-.43.18-.755.572-.85.986L2.29 9.074c-1.144 5.118 2.06 9.805 7.07 11.023l.18.04c.88.2 1.77.3 2.66.3 3.69 0 7.24-1.74 9.4-4.88.49-.72.84-1.5.99-2.28l.21-1.07c.06-.32.09-.64.09-.96 0-1.75-.8-3.37-2.67-4.83zm-6.17 11.04c-1.8 1.16-4.04 1.49-6.07.95l-.18-.04c-3.78-.92-6.17-4.43-5.32-8.23l.73-3.08c3.27-1.12 8.44.82 11.7 2.45l-.86 7.95zm8.5-7.38l-.21 1.07c-.12.63-.4 1.25-.8 1.81-1.63 2.37-4.3 3.69-7.1 3.69-.32 0-.64-.01-.96-.04l.58-5.34c1.64 1.25 2.25 2.37 2.25 3.69 0 .26-.02.51-.07.75l.93-.38c.68-.28.99-1.05.71-1.73-.28-.68-1.05-.99-1.73-.71l-.73.3c.04-.24.06-.49.06-.75 0-1.85-1.18-3.48-3.23-4.7l1.04-4.8c4.27 2.37 7.76 4.3 8.35 4.67.4.24.66.58.74 1.01.03.14.04.29.04.43 0 .47-.07.94-.17 1.4z"></path>`,
};

// Hover styles for each platform
export const platformStyles: Record<SocialPlatform, string> = {
  linkedin: "hover:bg-[#0077B5] hover:text-white hover:border-[#0077B5]",
  github: "hover:bg-slate-900 hover:text-white hover:border-slate-900",
  twitter: "hover:bg-black hover:text-white hover:border-black",
  youtube: "hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000]",
  instagram:
    "hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white hover:border-[#dc2743]",
  email: "hover:bg-security-blue hover:text-white hover:border-security-blue",
  paypal: "hover:bg-[#003087] hover:text-white hover:border-[#003087]",
  buymeacoffee: "hover:bg-[#FFDD00] hover:text-black hover:border-[#FFDD00]",
};

// Export data from JSON
export const author: AuthorInfo = socialData.author;
export const socialNetworks: SocialNetwork[] =
  socialData.socialNetworks as SocialNetwork[];

export const donationLinks: SocialNetwork[] = (socialData.donationLinks ||
  []) as SocialNetwork[];

// Helper to get specific platforms
export function getSocialByPlatform(
  platform: SocialPlatform,
): SocialNetwork | undefined {
  return socialNetworks.find((s) => s.platform === platform);
}

// Helper to get multiple platforms
export function getSocialsByPlatforms(
  platforms: SocialPlatform[],
): SocialNetwork[] {
  return socialNetworks.filter((s) => platforms.includes(s.platform));
}

// Get main social networks (exclude email by default)
export function getMainSocials(): SocialNetwork[] {
  return socialNetworks.filter((s) => s.platform !== "email");
}
