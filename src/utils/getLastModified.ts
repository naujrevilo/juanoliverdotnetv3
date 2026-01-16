import { execSync } from "child_process";

/**
 * Obtiene la fecha de última modificación (commit) de un archivo usando git log.
 * @param filePath Ruta absoluta o relativa al archivo
 * @returns Fecha ISO de última modificación o null si no hay commit
 */
export function getLastModified(filePath: string): string | null {
  try {
    const result = execSync(`git log -1 --format="%cI" -- "${filePath}"`, {
      encoding: "utf-8",
    });
    return result.trim() || null;
  } catch (err) {
    return null;
  }
}
