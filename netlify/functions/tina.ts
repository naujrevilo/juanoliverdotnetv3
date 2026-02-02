import "./env-setup"; // MUST BE FIRST to sanitize process.env
import { TinaNodeBackend, LocalBackendAuthProvider } from "@tinacms/datalayer";
// Dynamic import used instead of static to prevent boot crashes
// import databaseClient from "../../tina/database";
import serverless from "serverless-http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createClerkClient } from "@clerk/clerk-sdk-node";

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

// --- EXPRESS WRAPPER SETUP ---
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true, // Allow all origins for now to avoid CORS issues
    credentials: true,
  }),
);

// Initialize Clerk Client
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey:
    process.env.PUBLIC_CLERK_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    process.env.TINA_PUBLIC_CLERK_PUBLISHABLE_KEY,
});

// Global Tina Handler Cache
let cachedTinaHandler: any = null;

const getTinaHandler = async () => {
  if (cachedTinaHandler) return cachedTinaHandler;

  console.log("Initializing Tina Handler...");

  let databaseClient;
  try {
    console.log("Importing Database Client...");
    const dbModule = await import("../../tina/database");
    databaseClient = dbModule.default;
    console.log("Database Client Imported Successfully");
  } catch (e) {
    console.error("CRITICAL: Failed to import database client:", e);
    throw e;
  }

  const authProvider = isLocal
    ? LocalBackendAuthProvider()
    : {
        isAuthorized: async (req: any) => {
          try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
              console.log("[Clerk Auth] No valid authorization header found");
              return {
                isAuthorized: false,
                errorMessage: "No valid authorization header found",
                errorCode: 401,
              } as const;
            }

            const token = authHeader.split(" ")[1];

            // Verify token using Clerk SDK
            // This validates the token signature and expiration
            const claims = await clerkClient.verifyToken(token);

            // Check if user has 'admin' role
            // We fetch the user to get the latest metadata
            const user = await clerkClient.users.getUser(claims.sub);

            if (user.publicMetadata?.role !== "admin") {
              console.log(
                `[Clerk Auth] User ${claims.sub} is not an admin (role: ${user.publicMetadata?.role})`,
              );
              return {
                isAuthorized: false,
                errorMessage: "User is not an admin",
                errorCode: 403,
              } as const;
            }

            // If verification succeeds, the user is authorized
            return { isAuthorized: true } as const;
          } catch (e) {
            console.error("[Clerk Auth] Authorization failed:", e);
            return {
              isAuthorized: false,
              errorMessage: (e as any).message || "Authorization failed",
              errorCode: 401,
            } as const;
          }
        },
      };

  cachedTinaHandler = TinaNodeBackend({
    authProvider,
    databaseClient,
  });

  return cachedTinaHandler;
};

// Route Handler
app.all("/api/tina/*", async (req, res) => {
  try {
    const handler = await getTinaHandler();
    await handler(req, res);
  } catch (e) {
    console.error("Tina Handler Execution Failed:", e);
    res.status(500).json({
      error: "Internal Server Error",
      message: (e as any).message,
      stack: (e as any).stack,
    });
  }
});

export const handler = serverless(app);
