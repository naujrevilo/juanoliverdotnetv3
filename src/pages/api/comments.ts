/**
 * @fileoverview API de comentarios del blog.
 * GET  /api/comments?slug=xxx  → Retorna comentarios aprobados
 * POST /api/comments           → Crea un comentario pendiente de moderación
 */
import type { APIRoute } from "astro";
import { db } from "../../db/client";
import { comments } from "../../db/schema";
import { and, eq, desc } from "drizzle-orm";

export const prerender = false;

const HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
} as const;

const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 160;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_SLUG_LENGTH = 256;

function jsonResponse(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), { status, headers: HEADERS });
}

function sanitize(input: string, max: number) {
  return input.trim().replace(/\s+/g, " ").slice(0, max);
}

function validateEmail(input: string): boolean {
  if (!input || input.length > MAX_EMAIL_LENGTH) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.trim());
}

// ─── GET: Listar comentarios aprobados de un post ───────────────────────────

export const GET: APIRoute = async ({ url }) => {
  const slug = url.searchParams.get("slug")?.trim();

  if (!slug || slug.length > MAX_SLUG_LENGTH) {
    return jsonResponse(400, { error: "Parámetro slug inválido o faltante." });
  }

  try {
    const rows = await db
      .select({
        id: comments.id,
        name: comments.name,
        message: comments.message,
        createdAt: comments.createdAt,
      })
      .from(comments)
      .where(and(eq(comments.postSlug, slug), eq(comments.approved, 1)))
      .orderBy(desc(comments.createdAt));

    return jsonResponse(200, {
      comments: rows.map(({ id, name, message, createdAt }) => ({
        id,
        name,
        message,
        createdAt: createdAt instanceof Date ? createdAt.toISOString() : new Date(createdAt as number * 1000).toISOString(),
      })),
      count: rows.length,
    });
  } catch (error) {
    console.error("[API/comments] Error al obtener comentarios:", error);
    return jsonResponse(500, { error: "Error al obtener comentarios." });
  }
};

// ─── POST: Crear comentario (pendiente de moderación) ───────────────────────

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get("content-type") ?? "";
  let body: Record<string, string | null | undefined> | null = null;

  try {
    if (contentType.includes("application/json")) {
      const raw = await request.json();
      if (raw && typeof raw === "object") body = raw as Record<string, string>;
    } else if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      const fd = await request.formData();
      body = {
        slug: fd.get("slug")?.toString(),
        name: fd.get("name")?.toString(),
        email: fd.get("email")?.toString() ?? null,
        message: fd.get("message")?.toString(),
        website: fd.get("website")?.toString() ?? null,
      };
    }
  } catch {
    return jsonResponse(400, { error: "Payload inválido." });
  }

  if (!body) {
    return jsonResponse(415, { error: "Content-Type no soportado." });
  }

  // Honeypot anti-spam
  if (body.website) {
    return jsonResponse(201, { status: "pending" });
  }

  const slug = body.slug?.trim();
  const name = body.name?.trim();
  const email = body.email?.trim() ?? null;
  const message = body.message?.trim();

  if (!slug || slug.length > MAX_SLUG_LENGTH) {
    return jsonResponse(400, { error: "Slug inválido." });
  }
  if (!name || name.length < 2 || name.length > MAX_NAME_LENGTH) {
    return jsonResponse(400, { error: "Nombre requerido (2-120 chars)." });
  }
  if (!message || message.length < 8 || message.length > MAX_MESSAGE_LENGTH) {
    return jsonResponse(400, { error: "Mensaje requerido (8-2000 chars)." });
  }
  if (email && !validateEmail(email)) {
    return jsonResponse(400, { error: "Email inválido." });
  }

  try {
    await db.insert(comments).values({
      postSlug: slug,
      name: sanitize(name, MAX_NAME_LENGTH),
      email: email ? email.slice(0, MAX_EMAIL_LENGTH) : null,
      message: message.slice(0, MAX_MESSAGE_LENGTH),
      website: null,
      approved: 0,
    });
  } catch (error) {
    console.error("[API/comments] Error al guardar comentario:", error);
    return jsonResponse(500, { error: "Error al guardar el comentario." });
  }

  return jsonResponse(201, { status: "pending" });
};
