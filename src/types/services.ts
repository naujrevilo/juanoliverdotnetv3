export interface Pricing {
  type: "project" | "hourly" | "monthly";
  basePrice: number;
  unit: string;
  hourlyRate?: number;
  estimatedHours?: string;
  minimumHours?: number;
  note?: string;
}

export interface Service {
  id: string;
  code?: string;
  unspsc?: string;
  title: string;
  shortDescription: string;
  description: string;
  benefits: string[];
  forWhom: string;
  icon: string;
  category: string;
  featured?: boolean;
  pricing?: Pricing;
  requiresPlatform?: boolean;
  platformName?: string;
  availableDate?: string;
}

export interface Category {
  title: string;
  description: string;
}
