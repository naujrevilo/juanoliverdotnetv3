import "./env-setup"; // MUST BE FIRST to sanitize process.env
import {
  TinaNodeBackend,
  LocalBackendAuthProvider,
  createDatabase,
  createLocalDatabase,
} from "@tinacms/datalayer";
import serverless from "serverless-http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createClerkClient } from "@clerk/clerk-sdk-node";

// Database Adapters Imports (Safe Pattern)
// @ts-ignore
import * as mongodbLevelPkgImport from "mongodb-level";
// @ts-ignore
import * as gitProviderPkgImport from "tinacms-gitprovider-github";

// Helper to sanitize env vars
const sanitize = (val: string | undefined) => {
  return val ? val.replace(/['"`]/g, "").trim() : "";
};

// Safe unwrap of adapters
// @ts-ignore
const mongodbLevelPkg = mongodbLevelPkgImport as any;
// @ts-ignore
const gitProviderPkg = gitProviderPkgImport as any;

// @ts-ignore
const MongodbLevel =
  mongodbLevelPkg.MongodbLevel ||
  mongodbLevelPkg.default?.MongodbLevel ||
  mongodbLevelPkg.default ||
  mongodbLevelPkg;
// @ts-ignore
const GitHubProvider =
  gitProviderPkg.GitHubProvider ||
  gitProviderPkg.default?.GitHubProvider ||
  gitProviderPkg.default ||
  gitProviderPkg;

const isLocal =
  sanitize(process.env.TINA_PUBLIC_IS_LOCAL) === "true" && !process.env.NETLIFY; // Force production mode on Netlify

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

// Database Initialization
const initDatabase = () => {
  if (isLocal) {
    console.log("Initializing Local Database...");
    return createLocalDatabase();
  }

  console.log("Initializing Production Database (MongoDB + GitHub)...");
  console.log("Branch:", sanitize(process.env.GITHUB_BRANCH || "main"));
  console.log("Repo:", sanitize(process.env.GITHUB_REPO));

  return createDatabase({
    gitProvider: new GitHubProvider({
      branch: sanitize(process.env.GITHUB_BRANCH || "main"),
      owner: sanitize(process.env.GITHUB_OWNER),
      repo: sanitize(process.env.GITHUB_REPO),
      token: sanitize(process.env.GITHUB_PERSONAL_ACCESS_TOKEN),
    }),
    databaseAdapter: new MongodbLevel({
      collectionName: "tinacms",
      dbName: "tinacms",
      mongoUri: sanitize(process.env.MONGODB_URI),
    }),
    // @ts-ignore
    isAuthorized: async (session: any) => {
      return !!session?.user;
    },
  });
};

// Global Tina Handler Cache
let cachedTinaHandler: any = null;

const getTinaHandler = async () => {
  if (cachedTinaHandler) return cachedTinaHandler;

  console.log("Creating Tina Handler...");

  let databaseClient;
  try {
    databaseClient = await initDatabase();
    console.log("Database Client Initialized Successfully");
  } catch (e) {
    console.error("CRITICAL: Failed to initialize database client:", e);
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
            const claims = await clerkClient.verifyToken(token);
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
app.all("*", async (req, res) => {
  try {
    console.log("Incoming Request URL:", req.url);
    console.log("Incoming Request Method:", req.method);

    // Rewrite URL to strip Netlify function path
    // This ensures TinaCMS router sees paths like '/graphql' instead of '/.netlify/functions/tina/graphql'
    if (req.url.startsWith("/.netlify/functions/tina")) {
      const originalUrl = req.url;
      let newUrl = req.url.replace("/.netlify/functions/tina", "");
      // Default to /graphql if path is empty or just slash
      if (!newUrl || newUrl === "/") {
        newUrl = "/graphql";
      }
      req.url = newUrl;
      console.log(`URL Rewrite: ${originalUrl} -> ${req.url}`);
    }

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
