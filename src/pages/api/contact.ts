/**
 * @fileoverview Contact form endpoint.
 * POST /api/contact → validates fields, sends email via Resend
 */
import type { APIRoute } from "astro";
import { Resend } from "resend";

export const prerender = false;

const HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
} as const;

const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 160;
const MAX_MESSAGE_LENGTH = 2000;

function jsonResponse(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), { status, headers: HEADERS });
}

function sanitize(input: string, max: number) {
  return input.trim().replace(/\s+/g, " ").slice(0, max);
}

function validateEmail(input: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
}

export const POST: APIRoute = async ({ request, locals }) => {
  const apiKey = (locals.runtime?.env as Record<string, string> | undefined)
    ?.RESEND_API_KEY;

  if (!apiKey) {
    return jsonResponse(500, { error: "Email service not configured." });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(400, { error: "Invalid request body." });
  }

  const name = sanitize(String(body.name ?? ""), MAX_NAME_LENGTH);
  const email = sanitize(String(body.email ?? ""), MAX_EMAIL_LENGTH);
  const consulta_tipo = sanitize(String(body.consulta_tipo ?? ""), 100);
  const message = sanitize(String(body.message ?? ""), MAX_MESSAGE_LENGTH);

  if (!name || !email || !consulta_tipo || !message) {
    return jsonResponse(400, { error: "All fields are required." });
  }

  if (!validateEmail(email)) {
    return jsonResponse(400, { error: "Invalid email address." });
  }

  const resend = new Resend(apiKey);

  const toEmail = (locals.runtime?.env as Record<string, string> | undefined)
    ?.CONTACT_EMAIL ?? "juan@juanoliver.net";

  const { error } = await resend.emails.send({
    from: "web@juanoliver.net",
    to: toEmail,
    replyTo: email,
    subject: `Nuevo contacto web: ${consulta_tipo}`,
    html: `
      <h2>Nuevo mensaje de contacto</h2>
      <table cellpadding="8" style="border-collapse:collapse;width:100%;max-width:600px">
        <tr><td><strong>Nombre</strong></td><td>${name}</td></tr>
        <tr><td><strong>Email</strong></td><td><a href="mailto:${email}">${email}</a></td></tr>
        <tr><td><strong>Tipo de consulta</strong></td><td>${consulta_tipo}</td></tr>
        <tr><td><strong>Mensaje</strong></td><td style="white-space:pre-wrap">${message}</td></tr>
      </table>
    `,
  });

  if (error) {
    console.error("[contact] Resend error:", error);
    return jsonResponse(500, { error: "Failed to send message. Try again later." });
  }

  return jsonResponse(200, { ok: true });
};
