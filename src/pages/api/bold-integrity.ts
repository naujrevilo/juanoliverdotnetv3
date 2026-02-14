import type { APIRoute } from "astro";
import { z } from "zod";
import { rateLimit, createRateLimitResponse } from "../../lib/rate-limit";
import { generateBoldSignature } from "../../lib/bold";

const BoldIntegritySchema = z.object({
  orderId: z.string().min(1),
  amount: z.number().positive(),
  currency: z.string().length(3).default("COP"),
});

export const POST: APIRoute = async ({ request }) => {
  if (rateLimit(request, { maxRequests: 15, windowMs: 60_000 })) {
    return createRateLimitResponse();
  }

  try {
    const body = await request.json();
    const parsed = BoldIntegritySchema.safeParse(body);

    if (!parsed.success) {
      console.error("Bold integrity validation failed:", parsed.error.issues);
      return new Response(JSON.stringify({ error: "Invalid request format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { orderId, amount, currency } = parsed.data;

    const secretKey = import.meta.env.BOLD_SECRET_KEY?.trim();

    if (!secretKey) {
      console.error("BOLD_SECRET_KEY is not defined in environment variables.");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    const signature = generateBoldSignature(
      orderId,
      amount.toString(),
      currency,
      secretKey,
    );

    const apiKey = import.meta.env.BOLD_IDENTITY_KEY?.trim();

    if (!apiKey) {
      console.error(
        "BOLD_IDENTITY_KEY is not defined in environment variables.",
      );
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ signature, apiKey }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating Bold signature:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
