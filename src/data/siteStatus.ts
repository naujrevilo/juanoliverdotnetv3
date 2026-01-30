export type SystemStatus =
  | "Todos los sistemas operativos"
  | "Mantenimiento programado"
  | "Problemas de rendimiento"
  | "Interrupción parcial"
  | "Interrupción mayor";

export const siteStatus: {
  status: SystemStatus;
  lastUpdated: string;
} = {
  status: "Todos los sistemas operativos",
  lastUpdated: new Date().toISOString(), // Default to build time or manual update
};
