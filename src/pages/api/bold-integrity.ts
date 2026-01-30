import type { APIRoute } from "astro";
import { generateBoldSignature } from "../../lib/bold";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { orderId, amount, currency = "COP" } = body;

    if (!orderId || !amount) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: orderId, amount",
        }),
        { status: 400 },
      );
    }

    const secretKey = import.meta.env.BOLD_SECRET_KEY?.trim();

    if (!secretKey) {
      console.error("BOLD_SECRET_KEY is not defined in environment variables.");
      return new Response(
        JSON.stringify({
          error: "Server configuration error",
        }),
        { status: 500 },
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
      console.error("BOLD_IDENTITY_KEY is not defined in environment variables.");
      return new Response(
        JSON.stringify({
          error: "Server configuration error: Missing Identity Key",
        }),
        { status: 500 },
      );
    }

    return new Response(
      JSON.stringify({
        signature,
        apiKey,
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error generating Bold signature:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
};
