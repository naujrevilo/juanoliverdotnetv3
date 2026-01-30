import { createHash } from "node:crypto";

/**
 * Generates the integrity signature for Bold payments.
 * Formula: SHA256(orderId + amount + currency + secretKey)
 */
export function generateBoldSignature(
  orderId: string,
  amount: string,
  currency: string,
  secretKey: string,
): string {
  const data = `${orderId}${amount}${currency}${secretKey}`;
  return createHash("sha256").update(data).digest("hex");
}
