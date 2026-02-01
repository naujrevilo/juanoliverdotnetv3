import dotenv from "dotenv";
dotenv.config();

console.log("[EnvSetup] Starting environment check...");

// Helper to clean string
const cleanString = (str: string) => {
  return str.replace(/['"`\s]/g, "").trim();
};

// 1. Fix NEXTAUTH_URL
if (process.env.NEXTAUTH_URL) {
  const original = process.env.NEXTAUTH_URL;
  const clean = cleanString(original);

  // Debug: Print char codes to identify hidden chars
  const charCodes = original
    .split("")
    .map((c) => c.charCodeAt(0))
    .join(",");
  console.log(
    `[EnvSetup] NEXTAUTH_URL Original: "${original}" (Length: ${original.length})`,
  );
  console.log(`[EnvSetup] Char Codes: [${charCodes}]`);

  if (original !== clean) {
    console.log(
      `[EnvSetup] NEXTAUTH_URL is dirty. Forcing clean value: "${clean}"`,
    );
    process.env.NEXTAUTH_URL = clean;
  }

  // HARD FALLBACK: If it still looks wrong (e.g. empty), force production URL
  if (!process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL.length < 10) {
    console.log(`[EnvSetup] NEXTAUTH_URL is invalid. Forcing Production URL.`);
    process.env.NEXTAUTH_URL = "https://juanoliverdotnetv3.netlify.app";
  }
} else {
  console.log(`[EnvSetup] NEXTAUTH_URL is missing. Forcing Production URL.`);
  process.env.NEXTAUTH_URL = "https://juanoliverdotnetv3.netlify.app";
}

// 2. Fix other keys
["NEXTAUTH_SECRET", "MONGODB_URI", "GITHUB_PERSONAL_ACCESS_TOKEN"].forEach(
  (key) => {
    if (process.env[key]) {
      const original = process.env[key]!;
      const clean = original.replace(/['"`]/g, "").trim(); // Don't remove internal spaces for keys/secrets if they have them (unlikely for these)
      if (original !== clean) {
        console.log(`[EnvSetup] Sanitizing ${key}`);
        process.env[key] = clean;
      }
    }
  },
);

console.log(`[EnvSetup] Final NEXTAUTH_URL: "${process.env.NEXTAUTH_URL}"`);

export const envSetup = true; // Export to ensure import is not tree-shaken
