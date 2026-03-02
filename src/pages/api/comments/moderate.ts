/**
 * @fileoverview API de moderación de comentarios.
 * POST /api/comments/moderate  → Aprobar o eliminar un comentario (requiere cookie de admin)
 *
 * Headers requeridos: Cookie con `joc-admin-token` = COMMENTS_MODERATION_TOKEN
 */
import type { APIRoute } from "astro";
import { db } from "../../../db/client";
import { comments } from "../../../db/schema";
import { eq } from "drizzle-orm";

export const prerender = false;

const COOKIE_NAME = "joc-admin-token";

export const POST: APIRoute = async ({ request, cookies }) => {
  const moderationToken = import.meta.env.COMMENTS_MODERATION_TOKEN;
  const providedToken = cookies.get(COOKIE_NAME)?.value ?? null;

  if (!moderationToken || providedToken !== moderationToken) {
    return new Response(JSON.stringify({ error: "No autorizado." }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  let body: { id?: number; action?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Payload inválido." }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const { id, action } = body;

  if (!id || !action) {
    return new Response(JSON.stringify({ error: "id y action son requeridos." }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  try {
    if (action === "approve") {
      await db
        .update(comments)
        .set({ approved: 1 })
        .where(eq(comments.id, id));
      // Notificar a las pestañas abiertas del mismo post
      // (BroadcastChannel solo funciona en el browser, aquí solo retornamos éxito)
    } else if (action === "delete") {
      await db.delete(comments).where(eq(comments.id, id));
    } else {
      return new Response(JSON.stringify({ error: "Acción inválida." }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    console.error("[API/comments/moderate] Error:", error);
    return new Response(JSON.stringify({ error: "Error interno." }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
};
