import "dotenv/config";
import { TwitterApi } from "twitter-api-v2";

export type SocialPayload = {
  title: string;
  url: string;
  summary?: string;
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
  const res = await fetch(`${instanceUrl.replace(/\/$/, "")}/api/v1/statuses`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status,
      visibility: "public",
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
    await client.v2.tweet(status);
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
        record: {
          $type: "app.bsky.feed.post",
          text: recordText,
          createdAt,
        },
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
import { fileURLToPath } from "url";
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
