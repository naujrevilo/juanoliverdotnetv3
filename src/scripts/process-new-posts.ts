import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { publishSocial } from "./publish-social";

const SITE_URL = process.env.PUBLIC_SITE_URL || "https://juanoliver.net";

/**
 * Verifica si el post debe ser publicado basándose en su historial git.
 * Retorna true si:
 * 1. El archivo es nuevo (no existía en el commit anterior).
 * 2. El archivo existía pero estaba en draft: true, y ahora está en draft: false.
 */
function shouldPublish(filePath: string, currentContent: string): boolean {
  try {
    // Intentar obtener el contenido del commit anterior (HEAD^)
    // En un merge commit, HEAD^ es el primer padre (la rama base, main)
    // Usar spawnSync para evitar inyección de comandos vía filePath
    const result = spawnSync("git", ["show", `HEAD^:${filePath}`], {
      stdio: ["pipe", "pipe", "ignore"],
      encoding: "utf-8",
    });

    if (result.status !== 0) {
      throw new Error(`git show failed with status ${result.status}`);
    }

    const previousContent = (result.stdout || "").trim();

    // Si llegamos aquí, el archivo existía. Verificamos su estado de borrador anterior.
    const prevDraftMatch = previousContent.match(/^draft:\s*(true|false)\s*$/m);
    const wasDraft = prevDraftMatch && prevDraftMatch[1] === "true";

    // Si antes era borrador, ahora es publicable (porque ya validamos draft:false fuera)
    if (wasDraft) {
      console.log(`[${filePath}] Transición detectada: Borrador -> Publicado.`);
      return true;
    }

    console.log(
      `[${filePath}] Saltado: Ya estaba publicado anteriormente (draft: false -> draft: false).`,
    );
    return false;
  } catch (error) {
    // Si git show falla, asumimos que el archivo no existía en HEAD^ (es nuevo)
    console.log(
      `[${filePath}] Detectado como archivo nuevo (sin historial previo).`,
    );
    return true;
  }
}

async function processFiles(files: string[]) {
  const projectRoot = path.resolve(process.cwd());
  console.log("Archivos detectados:", files);

  // Filtrar solo archivos .md/.mdx en src/content/blog
  const blogFiles = files.filter(
    (file) =>
      file.includes("src/content/blog/") &&
      (file.endsWith(".md") || file.endsWith(".mdx")),
  );

  if (blogFiles.length === 0) {
    console.log("Ningún post relevante detectado en la lista de cambios.");
    return;
  }

  console.log("Analizando candidatos:", blogFiles);

  for (const file of blogFiles) {
    try {
      // Validar que la ruta resuelta esté dentro del proyecto (prevenir path traversal)
      const resolvedFile = path.resolve(projectRoot, file);
      if (!resolvedFile.startsWith(projectRoot + path.sep)) {
        console.warn(`Ruta rechazada (fuera del proyecto): ${file}`);
        continue;
      }

      if (!fs.existsSync(resolvedFile)) {
        console.warn(`El archivo ${file} no existe en el disco.`);
        continue;
      }

      const content = fs.readFileSync(resolvedFile, "utf-8");

      // Extracción de frontmatter
      const titleMatch = content.match(/^title:\s*(.+)$/m);
      const descriptionMatch = content.match(/^description:\s*(.+)$/m);
      const draftMatch = content.match(/^draft:\s*(true|false)\s*$/m);

      // 1. Si el contenido actual dice draft: true, ignorar siempre.
      if (draftMatch && draftMatch[1] === "true") {
        console.log(`[${file}] Saltado: Actualmente es borrador.`);
        continue;
      }

      // 2. Verificar lógica de transición (Nuevo o Draft->Publicado)
      if (!shouldPublish(file, content)) {
        continue;
      }

      // Preparar publicación
      const slug = path.basename(file, path.extname(file));
      if (!titleMatch) {
        console.warn(`[${file}] Saltado: Sin título.`);
        continue;
      }

      const title = titleMatch[1].trim().replace(/^["']|["']$/g, "");
      const description = descriptionMatch
        ? descriptionMatch[1].trim().replace(/^["']|["']$/g, "")
        : undefined;

      const url = `${SITE_URL}/blog/${slug}`;

      console.log(`\n--- Publicando: ${title} ---`);
      console.log(`URL: ${url}`);

      const success = await publishSocial({
        title,
        url,
        summary: description,
      });

      if (!success) {
        console.error(`[${file}] Hubo errores en la publicación.`);
      }
    } catch (err) {
      console.error(`Error procesando archivo ${file}:`, err);
    }
  }
}

/**
 * Valida que un path de archivo sea seguro:
 * - Debe estar dentro del directorio del proyecto
 * - Debe coincidir con el patrón esperado de archivos de blog
 */
function sanitizeFilePath(rawPath: string): string | null {
  const projectRoot = path.resolve(process.cwd());
  const resolved = path.resolve(projectRoot, rawPath);

  // Prevenir path traversal: el archivo debe estar dentro del proyecto
  if (!resolved.startsWith(projectRoot + path.sep)) {
    console.warn(`Ruta rechazada (fuera del proyecto): ${rawPath}`);
    return null;
  }

  // Validar que solo contenga caracteres seguros (letras, números, guiones, barras, puntos)
  if (!/^[a-zA-Z0-9/_\-. ]+$/.test(rawPath)) {
    console.warn(`Ruta rechazada (caracteres no permitidos): ${rawPath}`);
    return null;
  }

  return resolved;
}

// Los argumentos vienen desde la línea de comandos
// GitHub Action pasará la lista de archivos como argumentos separados por espacio
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("No se proporcionaron archivos para procesar.");
} else {
  const safeArgs = args
    .map(sanitizeFilePath)
    .filter((p): p is string => p !== null);

  if (safeArgs.length === 0) {
    console.log("Ningún archivo válido para procesar.");
  } else {
    processFiles(safeArgs).catch((err) => {
      console.error("Error fatal en el script de auto-publicación:", err);
      process.exit(1);
    });
  }
}
