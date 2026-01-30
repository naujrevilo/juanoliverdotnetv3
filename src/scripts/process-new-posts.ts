import fs from 'fs';
import path from 'path';
import { publishSocial } from './publish-social';

const SITE_URL = process.env.PUBLIC_SITE_URL || 'https://juanoliver.net';

async function processFiles(files: string[]) {
  console.log('Archivos detectados:', files);
  
  // Filtrar solo archivos .md/.mdx en src/content/blog que hayan sido añadidos
  const blogFiles = files.filter(file => 
    file.includes('src/content/blog/') && 
    (file.endsWith('.md') || file.endsWith('.mdx'))
  );

  if (blogFiles.length === 0) {
    console.log('Ningún post nuevo detectado en la lista de cambios.');
    return;
  }

  console.log('Procesando nuevos posts:', blogFiles);
  
  for (const file of blogFiles) {
    try {
      // Verificar si el archivo existe (puede haber sido borrado en el mismo commit, aunque improbable si es 'added')
      if (!fs.existsSync(file)) {
        console.warn(`El archivo ${file} no existe en el disco.`);
        continue;
      }

      const content = fs.readFileSync(file, 'utf-8');
      
      // Extracción simple de frontmatter con regex
      const titleMatch = content.match(/^title:\s*(.+)$/m);
      const descriptionMatch = content.match(/^description:\s*(.+)$/m);
      
      // Slug es el nombre del archivo sin extensión
      const slug = path.basename(file, path.extname(file));
      
      if (!titleMatch) {
        console.warn(`[${file}] Saltado: No se encontró título en el frontmatter.`);
        continue;
      }

      const title = titleMatch[1].trim().replace(/^["']|["']$/g, '');
      const description = descriptionMatch 
        ? descriptionMatch[1].trim().replace(/^["']|["']$/g, '') 
        : undefined;
      
      // Construir URL pública
      // Asumimos que la estructura de URL es /blog/[slug]
      const url = `${SITE_URL}/blog/${slug}`;
      
      console.log(`\n--- Publicando: ${title} ---`);
      console.log(`URL: ${url}`);
      
      const success = await publishSocial({
        title,
        url,
        summary: description
      });

      if (!success) {
        console.error(`[${file}] Hubo errores en la publicación.`);
        // No lanzamos error fatal para intentar publicar los siguientes si los hay
      }
      
    } catch (err) {
      console.error(`Error procesando archivo ${file}:`, err);
    }
  }
}

// Los argumentos vienen desde la línea de comandos
// GitHub Action pasará la lista de archivos como argumentos separados por espacio
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('No se proporcionaron archivos para procesar.');
} else {
  processFiles(args).catch(err => {
    console.error('Error fatal en el script de auto-publicación:', err);
    process.exit(1);
  });
}
