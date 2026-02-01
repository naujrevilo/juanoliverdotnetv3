import dotenv from "dotenv";
dotenv.config();

console.log("[EnvSetup] Running environment sanitization...");

// IMMEDIATE SANITIZATION
if (process.env.NEXTAUTH_URL) {
  const original = process.env.NEXTAUTH_URL;
  // Remove spaces, quotes (single/double), and backticks
  const sanitized = original.replace(/['"`\s]/g, "");
  
  if (original !== sanitized) {
    console.log(`[EnvSetup] Sanitizing NEXTAUTH_URL. Original: "${original}" -> Sanitized: "${sanitized}"`);
    process.env.NEXTAUTH_URL = sanitized;
  } else {
    console.log(`[EnvSetup] NEXTAUTH_URL is clean: "${original}"`);
  }
} else {
  // Fallback if missing (or empty after cleaning)
  console.log("[EnvSetup] NEXTAUTH_URL is missing. Setting default.");
  process.env.NEXTAUTH_URL = "https://juanoliverdotnetv3.netlify.app";
}

// Sanitize other critical keys
["NEXTAUTH_SECRET", "MONGODB_URI", "GITHUB_PERSONAL_ACCESS_TOKEN"].forEach((key) => {
  if (process.env[key]) {
    const original = process.env[key]!;
    const sanitized = original.replace(/['"`]/g, "").trim();
    if (original !== sanitized) {
      console.log(`[EnvSetup] Sanitizing ${key}.`);
      process.env[key] = sanitized;
    }
  }
});
