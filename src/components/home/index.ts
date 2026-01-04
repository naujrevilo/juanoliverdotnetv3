// Home page components barrel export
export { default as HeroSection } from "./HeroSection.astro";
export { default as HeroBadge } from "./HeroBadge.astro";
export { default as HeroStats } from "./HeroStats.astro";
export { default as HeroCTAs } from "./HeroCTAs.astro";
export { default as ServicesSection } from "./ServicesSection.astro";
export { default as ServiceCard } from "./ServiceCard.astro";
export { default as AboutSection } from "./AboutSection.astro";
export { default as ProfileCard } from "./ProfileCard.astro";
export { default as SocialLink } from "./SocialLink.astro";
export { default as CTASection } from "./CTASection.astro";

// Re-export social data utilities for convenience
export {
  author,
  socialNetworks,
  getMainSocials,
  getSocialByPlatform,
  getSocialsByPlatforms,
  socialIcons,
  platformStyles,
  type SocialPlatform,
  type SocialNetwork,
  type AuthorInfo,
} from "../../data/social";
