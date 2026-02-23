import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { publishSocial } from "./publish-social";

const SITE_URL = process.env.PUBLIC_SITE_URL || "https://juanoliver.net";

/**
 * Archivo de tracking para posts ya publicados.
 * Previene publicar el mismo post múltiples veces en ejecuciones sucesivas.
 */
const PUBLISHED_POSTS_FILE = ".published-posts.json";

function getPublishedPosts(): Set<string> {
  try {
    if (fs.existsSync(PUBLISHED_POSTS_FILE)) {
      const data = JSON.parse(fs.readFileSync(PUBLISHED_POSTS_FILE, "utf-8"));
      return new Set(data.published || []);
    }
  } catch (err) {
    console.warn("Advertencia: No se pudo leer archivo de posts publicados:", err);
  }
  return new Set();
}

function savePublishedPosts(published: Set<string>): void {
  try {
    fs.writeFileSync(
      PUBLISHED_POSTS_FILE,
      JSON.stringify({ published: Array.from(published) }, null, 2),
    );
  } catch (err) {
    console.error("Error guardando archivo de posts publicados:", err);
  }
}

/**
 * Verifica si el post debe ser publicado.
 * Retorna true si el post no ha sido publicado anteriormente.
 */
function shouldPublish(filePath: string, publishedPosts: Set<string>): boolean {
  // Usar el slug del archivo como identificador único
  const slug = path.basename(filePath, path.extname(filePath));
  
  if (publishedPosts.has(slug)) {
    console.log(`[${filePath}] Saltado: Ya fue publicado anteriormente.`);
    return false;
  }
  
  return true;
}

async function processFiles(files: string[]) {
  const projectRoot = path.resolve(process.cwd());
  console.log("Archivos detectados:", files);
  
  // Cargar posts ya publicados
  const publishedPosts = getPublishedPosts();
  const newPublishedPosts = new Set(publishedPosts);

  // Filtrar solo archivos .md/.mdx en src/content/blog
  // Normalizar separadores de ruta (Windows usa \, Linux/Mac usan /)
  const blogFiles = files.filter(
    (file) => {
      const normalized = file.replace(/\\/g, "/");
      return (
        normalized.includes("src/content/blog/") &&
        (normalized.endsWith(".md") || normalized.endsWith(".mdx"))
      );
    },
  ).map((file) => file.replace(/\\/g, "/"));

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
      const socialImageMatch = content.match(/^socialImage:\s*(.+)$/m);
      const draftMatch = content.match(/^draft:\s*(true|false)\s*$/m);

      // 1. Si el contenido actual dice draft: true, ignorar siempre.
      if (draftMatch && draftMatch[1] === "true") {
        console.log(`[${file}] Saltado: Actualmente es borrador.`);
        continue;
      }

      // 2. Verificar lógica de transición (Nuevo o Draft->Publicado)
      if (!shouldPublish(file, publishedPosts)) {
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
      
      // Resolver la ruta de socialImage
      let imageUrl: string | undefined;
      if (socialImageMatch) {
        const imagePath = socialImageMatch[1].trim().replace(/^["']|["']$/g, "");
        const imageFileName = path.basename(imagePath);
        imageUrl = `${SITE_URL}/assets/imagesblog/${imageFileName}`;
      }

      const url = `${SITE_URL}/blog/${slug}`;

      console.log(`\n--- Publicando: ${title} ---`);
      console.log(`URL: ${url}`);

      const success = await publishSocial({
        title,
        url,
        summary: description,
        imageUrl,
      });

      // El éxito se log pero no bloqueamos si falla (algunas plataformas pueden tener errores transitivos)
      // El script siempre debe completar con éxito si al menos detectó y procesó los archivos
      if (!success) {
        console.warn(`[${file}] Publicación parcial: Algunas plataformas fallaron, pero el post fue procesado.`);
      } else {
        console.log(`[${file}] Publicación completada.`);
      }
      
      // Marcar el post como publicado
      newPublishedPosts.add(slug);
    } catch (err) {
      console.error(`Error procesando archivo ${file}:`, err);
    }
  }
  
  // Guardar posts publicados para evitar duplicados en futuras ejecuciones
  savePublishedPosts(newPublishedPosts);
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
      // No salir con error - permitir que el workflow continúe incluso si hay errores
      // (El objetivo es publicar, no fallar completamente por errores transitivos)
    });
  }
}
