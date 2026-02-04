import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const signatureHeader = request.headers.get("x-bold-signature");
    const bodyText = await request.text(); // Get raw body for signature verification
    
    console.log("Bold Webhook Received:", {
      signature: signatureHeader,
      body: bodyText
    });

    if (!signatureHeader) {
      return new Response("Missing signature", { status: 400 });
    }

    // TODO: Verify signature
    // The documentation for Bold Colombia Webhook signature verification should be consulted.
    // It is likely SHA256(body + secret) or HMAC-SHA256.
    // Since we are in test mode and webhooks might not fire, we log this for future implementation.
    
    /*
    const secret = import.meta.env.BOLD_SECRET_KEY;
    const computedSignature = createHash("sha256").update(bodyText + secret).digest("hex");
    
    if (computedSignature !== signatureHeader) {
      console.error("Invalid Webhook Signature");
      return new Response("Invalid signature", { status: 401 });
    }
    */

    // Parse body to process the event
    const payload = JSON.parse(bodyText);
    const { payment_status, order_id } = payload;

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
