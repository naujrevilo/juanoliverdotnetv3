import type { APIRoute } from "astro";
import { createHmac } from "node:crypto";
import { z } from "zod";
import { rateLimit, createRateLimitResponse } from "../../lib/rate-limit";

const BoldWebhookSchema = z
  .object({
    payment_status: z.string(),
    order_id: z.string(),
  })
  .passthrough();

/**
 * Verifica la firma HMAC-SHA256 del webhook de Bold.
 * Retorna true si la firma es válida, false en caso contrario.
 */
function verifyBoldSignature(
  bodyText: string,
  signatureHeader: string,
  secret: string,
): boolean {
  const computedSignature = createHmac("sha256", secret)
    .update(bodyText)
    .digest("hex");

  // Comparación en tiempo constante para prevenir timing attacks
  if (computedSignature.length !== signatureHeader.length) {
    return false;
  }

  const a = Buffer.from(computedSignature, "hex");
  const b = Buffer.from(signatureHeader, "hex");

  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i]! ^ b[i]!;
  }
  return result === 0;
}

export const POST: APIRoute = async ({ request }) => {
  if (rateLimit(request, { maxRequests: 30, windowMs: 60_000 })) {
    return createRateLimitResponse();
  }

  try {
    const signatureHeader = request.headers.get("x-bold-signature");
    const bodyText = await request.text();

    if (!signatureHeader) {
      console.warn("Bold Webhook: Missing signature header");
      return new Response("Missing signature", { status: 400 });
    }

    const secret = import.meta.env.BOLD_SECRET_KEY?.trim();

    if (!secret) {
      console.error("BOLD_SECRET_KEY is not defined — cannot verify webhook.");
      return new Response("Server configuration error", { status: 500 });
    }

    if (!verifyBoldSignature(bodyText, signatureHeader, secret)) {
      console.error("Bold Webhook: Invalid signature");
      return new Response("Invalid signature", { status: 401 });
    }

    // Parse and validate body
    const parsed = BoldWebhookSchema.safeParse(JSON.parse(bodyText));

    if (!parsed.success) {
      console.error("Bold Webhook: Invalid payload", parsed.error.issues);
      return new Response("Invalid payload", { status: 400 });
    }

    const { payment_status, order_id } = parsed.data;

    // Handle payment success
    if (payment_status === "APPROVED") {
      console.log(`Payment approved for order: ${order_id}`);
      // TODO: Update database, send email, etc.
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Error processing Bold webhook:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
