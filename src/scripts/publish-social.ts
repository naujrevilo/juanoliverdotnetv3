import "dotenv/config";
import { TwitterApi } from "twitter-api-v2";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export type SocialPayload = {
  title: string;
  url: string;
  summary?: string;
  imageUrl?: string;
};

function buildStatus(
  { title, url, summary }: SocialPayload,
  maxLength: number,
): string {
  const baseParts = [title.trim()];
  if (summary && summary.trim().length > 0) {
    baseParts.push(summary.trim());
  }
  let text = baseParts.join(" – ");
  const ellipsis = "…";
  const urlPart = ` ${url}`;
  const maxTextLength = maxLength - urlPart.length;
  if (text.length > maxTextLength) {
    text =
      text.slice(0, Math.max(0, maxTextLength - ellipsis.length)) + ellipsis;
  }
  return `${text}${urlPart}`;
}

/**
 * Obtiene el contenido de la imagen desde un archivo local o URL HTTP.
 * Intenta primero leer localmente desde la carpeta src/assets/, luego intenta HTTP.
 */
async function getImageBuffer(
  imageUrl: string,
): Promise<{ buffer: ArrayBuffer; mimeType: string } | null> {
  // Determinar MIME type basado en extensión
  const mimeType = imageUrl.endsWith(".png")
    ? "image/png"
    : imageUrl.endsWith(".jpg") || imageUrl.endsWith(".jpeg")
      ? "image/jpeg"
      : "image/png";

  // Si es una URL de assets publica, intentar leer localmente primero desde src/
  if (imageUrl.includes("/assets/imagesblog/")) {
    const fileName = imageUrl.split("/").pop();
    if (fileName) {
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const projectRoot = path.resolve(__dirname, "..", "..");
      // Buscar en src/assets/imagesblog/
      const localPath = path.join(
        projectRoot,
        "src",
        "assets",
        "imagesblog",
        fileName,
      );

      try {
        if (fs.existsSync(localPath)) {
          const buffer = fs.readFileSync(localPath);
          console.log(`[Image] Imagen cargada localmente: ${localPath}`);
          return {
            buffer: buffer.buffer.slice(
              buffer.byteOffset,
              buffer.byteOffset + buffer.byteLength,
            ),
            mimeType,
          };
        }
      } catch (err) {
        console.warn(`[Image] Error leyendo archivo local ${localPath}:`, err);
      }
    }
  }

  // Fallback: intentar descargar desde HTTP
  try {
    const imageRes = await fetch(imageUrl);
    if (imageRes.ok) {
      const buffer = await imageRes.arrayBuffer();
      console.log(`[Image] Imagen descargada desde HTTP: ${imageUrl}`);
      return { buffer, mimeType };
    } else {
      console.warn(
        `[Image] Error al descargar ${imageUrl}: ${imageRes.status} ${imageRes.statusText}`,
      );
    }
  } catch (err) {
    console.warn(`[Image] Error descargando ${imageUrl}:`, err);
  }

  return null;
}

async function postToMastodon(payload: SocialPayload): Promise<void> {
  const instanceUrl = process.env.MASTODON_INSTANCE_URL;
  const token = process.env.MASTODON_ACCESS_TOKEN;
  if (!instanceUrl || !token) {
    console.log(
      "[Mastodon] Saltado: Faltan credenciales (Instance URL o Access Token).",
    );
    return;
  }
  const status = buildStatus(payload, 500);

  // Subir imagen si existe
  let mediaIds: string[] = [];
  if (payload.imageUrl) {
    console.log(
      `[Mastodon] Intentando subir imagen desde: ${payload.imageUrl}`,
    );
    const imageData = await getImageBuffer(payload.imageUrl);
    if (imageData) {
      try {
        const formData = new FormData();
        const blob = new Blob([imageData.buffer], { type: imageData.mimeType });
        const fileName =
          payload.imageUrl.split("/").pop() || "social-image.png";
        formData.append("file", blob, fileName);

        const uploadRes = await fetch(
          `${instanceUrl.replace(/\/$/, "")}/api/v2/media`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          },
        );

        if (uploadRes.ok) {
          const uploadData = (await uploadRes.json()) as { id: string };
          mediaIds.push(uploadData.id);
          console.log("[Mastodon] Imagen subida correctamente.");
        } else {
          console.warn(
            `[Mastodon] Error al subir imagen: ${uploadRes.status} ${uploadRes.statusText}`,
          );
        }
      } catch (err) {
        console.warn("[Mastodon] Advertencia: No se pudo subir la imagen", err);
      }
    }
  }

  const res = await fetch(`${instanceUrl.replace(/\/$/, "")}/api/v1/statuses`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status,
      visibility: "public",
      media_ids: mediaIds.length > 0 ? mediaIds : undefined,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Mastodon error ${res.status}: ${body}`);
  }
  console.log("[Mastodon] Post publicado exitosamente.");
}

async function postToX(payload: SocialPayload): Promise<void> {
  const appKey = process.env.X_API_KEY || process.env.X_API_CONSUMER_KEY;
  const appSecret =
    process.env.X_API_SECRET || process.env.X_API_CONSUMER_SECRET;
  const accessToken = process.env.X_ACCESS_TOKEN;
  const accessSecret = process.env.X_ACCESS_TOKEN_SECRET;

  if (!appKey || !appSecret || !accessToken || !accessSecret) {
    console.log(
      "[X] Saltado: Faltan credenciales (Consumer Key/Secret y Access Token/Secret).",
    );
    return;
  }

  try {
    const client = new TwitterApi({
      appKey,
      appSecret,
      accessToken,
      accessSecret,
    });

    const status = buildStatus(payload, 280);

    // Si hay imagen, subirla primero
    let mediaIds: string[] = [];
    if (payload.imageUrl) {
      console.log(`[X] Intentando subir imagen desde: ${payload.imageUrl}`);
      const imageData = await getImageBuffer(payload.imageUrl);
      if (imageData) {
        try {
          const media = await client.v1.uploadMedia(
            Buffer.from(imageData.buffer),
            {
              mimeType: imageData.mimeType,
            },
          );
          // uploadMedia retorna directamente el media_id_str como string
          const mediaId = media as string;
          if (mediaId) {
            mediaIds.push(mediaId);
            console.log("[X] Imagen subida correctamente.");
          } else {
            console.warn(
              "[X] Advertencia: No se pudo obtener media_id de la respuesta",
              media,
            );
          }
        } catch (err) {
          console.warn("[X] Advertencia: No se pudo subir la imagen", err);
        }
      }
    }

    // Publicar el tweet con o sin imagen
    if (mediaIds.length > 0) {
      await client.v2.tweet(status, { media: { media_ids: mediaIds as [string] } });
    } else {
      await client.v2.tweet(status);
    }
    console.log("[X] Post publicado exitosamente.");
  } catch (error: any) {
    console.error(`[X] Error al publicar: ${error.message}`);
    if (error.data) {
      console.error(
        "[X] Detalles del error:",
        JSON.stringify(error.data, null, 2),
      );
    }
    throw error;
  }
}

async function postToBluesky(payload: SocialPayload): Promise<void> {
  const handle = process.env.BLUESKY_HANDLE?.replace(/^@/, "");
  const password = process.env.BLUESKY_APP_PASSWORD;
  const serviceUrl =
    process.env.BLUESKY_SERVICE_URL ||
    process.env.BLUESKY_API_URL ||
    "https://bsky.social";
  if (!handle || !password) {
    console.log(
      "[Bluesky] Saltado: Faltan credenciales (Handle o App Password).",
    );
    return;
  }
  const sessionRes = await fetch(
    `${serviceUrl.replace(/\/$/, "")}/xrpc/com.atproto.server.createSession`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: handle, password }),
    },
  );
  if (!sessionRes.ok) {
    const body = await sessionRes.text();
    throw new Error(`Bluesky session error ${sessionRes.status}: ${body}`);
  }
  const session = (await sessionRes.json()) as {
    accessJwt: string;
    did: string;
  };

  const recordText = buildStatus(payload, 300);
  const createdAt = new Date().toISOString().replace(/\.\d+Z$/, "Z");

  // Preparar embed con imagen si existe
  let embed: any = undefined;
  if (payload.imageUrl) {
    console.log(`[Bluesky] Intentando subir imagen desde: ${payload.imageUrl}`);
    const imageData = await getImageBuffer(payload.imageUrl);
    if (imageData) {
      try {
        const uploadRes = await fetch(
          `${serviceUrl.replace(/\/$/, "")}/xrpc/com.atproto.repo.uploadBlob`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session.accessJwt}`,
              "Content-Type": imageData.mimeType,
            },
            body: imageData.buffer,
          },
        );

        if (uploadRes.ok) {
          const blobData = (await uploadRes.json()) as { blob: any };
          embed = {
            $type: "app.bsky.embed.images",
            images: [
              {
                image: blobData.blob,
                alt: payload.title,
              },
            ],
          };
          console.log("[Bluesky] Imagen subida correctamente.");
        } else {
          const errorText = await uploadRes.text();
          console.warn(
            `[Bluesky] Error al subir imagen: ${uploadRes.status} ${uploadRes.statusText} - ${errorText}`,
          );
        }
      } catch (err) {
        console.warn("[Bluesky] Advertencia: No se pudo subir la imagen", err);
      }
    }
  }

  const record: any = {
    $type: "app.bsky.feed.post",
    text: recordText,
    createdAt,
  };

  if (embed) {
    record.embed = embed;
  }

  const recordRes = await fetch(
    `${serviceUrl.replace(/\/$/, "")}/xrpc/com.atproto.repo.createRecord`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessJwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        repo: session.did,
        collection: "app.bsky.feed.post",
        record,
      }),
    },
  );
  if (!recordRes.ok) {
    const body = await recordRes.text();
    throw new Error(`Bluesky post error ${recordRes.status}: ${body}`);
  }
  console.log("[Bluesky] Post publicado exitosamente.");
}

async function postToLinkedIn(payload: SocialPayload): Promise<void> {
  const token = process.env.LINKEDIN_ACCESS_TOKEN;
  const authorUrn = process.env.LINKEDIN_AUTHOR_URN;

  if (!token || !authorUrn) {
    console.log(
      "[LinkedIn] Saltado: Faltan credenciales (LINKEDIN_ACCESS_TOKEN o LINKEDIN_AUTHOR_URN).",
    );
    return;
  }

  const commentary = payload.summary
    ? `${payload.title}\n\n${payload.summary}`
    : payload.title;

  const body = {
    author: authorUrn,
    commentary,
    visibility: "PUBLIC",
    distribution: {
      feedDistribution: "MAIN_FEED",
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    content: {
      article: {
        source: payload.url,
        title: payload.title,
        description: payload.summary,
      },
    },
    lifecycleState: "PUBLISHED",
    isReshareDisabledByAuthor: false,
  };

  const res = await fetch("https://api.linkedin.com/rest/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
      "LinkedIn-Version": "202601",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`LinkedIn error ${res.status}: ${errorBody}`);
  }

  console.log("[LinkedIn] Post publicado exitosamente.");
}

export async function publishSocial(payload: SocialPayload) {
  const results = await Promise.allSettled([
    postToMastodon(payload),
    postToX(payload),
    postToBluesky(payload),
    postToLinkedIn(payload),
  ]);

  const platforms = ["Mastodon", "X", "Bluesky", "LinkedIn"];
  let hasError = false;

  results.forEach((result, index) => {
    const name = platforms[index];
    if (result.status === "rejected") {
      console.error(
        `[${name}] fallo:`,
        result.reason instanceof Error
          ? result.reason.message
          : String(result.reason),
      );
      hasError = true;
    } else {
      console.log(`[${name}] publicado o ignorado (sin credenciales).`);
    }
  });

  return !hasError;
}

// Ejecución directa solo si se llama como script principal
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  async function main() {
    const [, , title, url, ...rest] = process.argv;
    if (!title || !url) {
      console.error(
        'Uso: pnpm social:publish "Titulo" "https://url-del-post" "Resumen opcional"',
      );
      process.exit(1);
    }
    const summary = rest.join(" ").trim() || undefined;
    const payload: SocialPayload = { title, url, summary };

    const success = await publishSocial(payload);
    if (!success) process.exit(1);
  }

  main().catch((err) => {
    console.error(
      "Error general al publicar:",
      err instanceof Error ? err.message : err,
    );
    process.exit(1);
  });
}
