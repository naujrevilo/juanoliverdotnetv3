import dotenv from "dotenv";
dotenv.config();

// Sanitize environment variables (remove quotes if present)
const sanitizeEnv = (key: string) => {
  if (process.env[key]) {
    process.env[key] = process.env[key]!.replace(/['"`]/g, "").trim();
  }
};

sanitizeEnv("NEXTAUTH_URL");
sanitizeEnv("NEXTAUTH_SECRET");
sanitizeEnv("MONGODB_URI");
sanitizeEnv("GITHUB_PERSONAL_ACCESS_TOKEN");

import express from "express";
import cookieParser from "cookie-parser";
import { TinaNodeBackend, LocalBackendAuthProvider } from "@tinacms/datalayer";
import { AuthJsBackendAuthProvider, TinaAuthJSOptions } from "tinacms-authjs";
import databaseClient from "../../tina/database";
import serverless from "serverless-http";
// @ts-ignore
import * as mongodbLevelPkgImport from "mongodb-level";
import bcrypt from "bcryptjs";

// Inline definition to avoid import issues in Netlify Functions
const CredentialsProvider = (options: any) => {
  return {
    id: "credentials",
    name: "Credentials",
    type: "credentials",
    credentials: {},
    authorize: () => null,
    options,
  };
};

// @ts-ignore
const mongodbLevelPkg = mongodbLevelPkgImport as any;
// @ts-ignore
const MongodbLevel =
  mongodbLevelPkg.MongodbLevel ||
  mongodbLevelPkg.default?.MongodbLevel ||
  mongodbLevelPkg.default ||
  mongodbLevelPkg;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

// Monkey-patch the databaseClient.get method to handle JSON string parsing automatically
// This ensures that even if the adapter returns a string, Tina/NextAuth receives a proper object
const originalGet = databaseClient.get.bind(databaseClient);
// @ts-ignore
databaseClient.get = async (key: string) => {
  try {
    const result = await originalGet(key);
    if (typeof result === "string") {
      try {
        const parsed = JSON.parse(result);
        // console.log(`[Tina Fix] Parsed JSON string for key: ${key}`);
        return parsed;
      } catch (e) {
        return result;
      }
    }
    return result;
  } catch (error) {
    throw error;
  }
};

const authOptions = isLocal
  ? undefined
  : TinaAuthJSOptions({
      databaseClient: databaseClient, // Use the patched client
      secret: (process.env.NEXTAUTH_SECRET || "secret").trim(),
      debug: true,
    });

// Custom Provider Implementation to bypass internal Tina/NextAuth errors
const CustomCredentialsProvider = CredentialsProvider({
  name: "Credentials",
  credentials: {
    username: { label: "Username", type: "text" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials: any) {
    console.log(
      `[CustomAuth] Attempting login for user: ${credentials?.username}`,
    );
    try {
      const username = credentials?.username;
      const password = credentials?.password;

      if (!username || !password) {
        console.log("[CustomAuth] Missing credentials");
        return null;
      }

      // Check both paths to be safe
      const key1 = `content/users/${username}.json`;
      const key2 = `src/content/users/${username}.json`;

      // @ts-ignore
      let user = await databaseClient.get(key1);
      if (!user) {
        console.log(`[CustomAuth] User not found at ${key1}, trying ${key2}`);
        // @ts-ignore
        user = await databaseClient.get(key2);
      }

      if (!user) {
        console.log(`[CustomAuth] User not found in DB`);
        return null;
      }

      // Handle string (even with monkey patch, just to be safe)
      if (typeof user === "string") {
        try {
          user = JSON.parse(user);
        } catch (e) {
          console.error("[CustomAuth] JSON parse error", e);
          return null;
        }
      }

      if (!user.password) {
        console.log("[CustomAuth] User has no password field");
        return null;
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        console.log("[CustomAuth] Password valid. Login successful.");
        return {
          id: user.username || username,
          name: user.username || username,
          email: user.email || `${username}@example.com`,
          image: user.image,
          // Pass other fields if needed
          ...user,
        };
      } else {
        console.log("[CustomAuth] Invalid password.");
        return null;
      }
    } catch (e) {
      console.error("[CustomAuth] Error in authorize:", e);
      return null;
    }
  },
});

// @ts-ignore
if (authOptions) {
  // @ts-ignore
  authOptions.providers = [CustomCredentialsProvider];
  // @ts-ignore
  authOptions.trustHost = true;
}

// Ensure NEXTAUTH_URL is clean (trim spaces, quotes, and backticks that might cause errors)
if (process.env.NEXTAUTH_URL) {
  const originalUrl = process.env.NEXTAUTH_URL;
  // Remove wrapping quotes/backticks if present (e.g. "'url'" or "`url`")
  // and trim whitespace
  process.env.NEXTAUTH_URL = process.env.NEXTAUTH_URL.replace(
    /^['"`]+|['"`]+$/g,
    "",
  ).trim();

  if (originalUrl !== process.env.NEXTAUTH_URL) {
    console.log(
      `[Tina Diagnostic] Cleaned NEXTAUTH_URL: "${originalUrl}" -> "${process.env.NEXTAUTH_URL}"`,
    );
  }
}

// Diagnostic route
app.get("/api/tina/test-db", async (req, res) => {
  const report: any = {
    env: {
      MONGODB_URI_DEFINED: !!process.env.MONGODB_URI,
      MONGODB_URI_LENGTH: process.env.MONGODB_URI?.length,
      NEXTAUTH_SECRET_DEFINED: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL_RAW: process.env.NEXTAUTH_URL, // Show what we are actually using
      NEXTAUTH_URL_LENGTH: process.env.NEXTAUTH_URL?.length,
      GITHUB_TOKEN_DEFINED: !!process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
      GITHUB_OWNER: process.env.GITHUB_OWNER,
      GITHUB_REPO: process.env.GITHUB_REPO,
      GITHUB_BRANCH: process.env.GITHUB_BRANCH,
      TINA_PUBLIC_IS_LOCAL: process.env.TINA_PUBLIC_IS_LOCAL,
    },
  };

  const userKey = "content/users/juanoliver.json";
  const userKeySrc = "src/content/users/juanoliver.json";

  // 1. GitHub Token Validation (Direct API Check)
  try {
    const token = (process.env.GITHUB_PERSONAL_ACCESS_TOKEN || "").trim();
    const owner = (process.env.GITHUB_OWNER || "").trim();
    const repo = (process.env.GITHUB_REPO || "").trim();

    if (token && owner && repo) {
      // Check Repo permissions
      const repoRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}`,
        {
          headers: {
            Authorization: `token ${token}`,
            "User-Agent": "TinaCMS-Diagnostic",
          },
        },
      );

      if (repoRes.ok) {
        const repoData: any = await repoRes.json();
        report.githubCheck = {
          status: "success",
          permissions: repoData.permissions, // { admin: true, push: true, pull: true }
          private: repoData.private,
          usedToken: token.substring(0, 4) + "...", // Log partial token for verification
        };
      } else {
        report.githubCheck = {
          status: "failed",
          statusCode: repoRes.status,
          message: await repoRes.text(),
          usedToken: token.substring(0, 4) + "...",
        };
      }
    } else {
      report.githubCheck = { status: "skipped", reason: "Missing env vars" };
    }
  } catch (ghError: any) {
    report.githubCheck = { status: "error", message: ghError.message };
  }

  // 2. Try to read the user via databaseClient (Official Path)
  // @ts-ignore
  let user: any = null;
  try {
    // @ts-ignore
    user = await databaseClient.get(userKey);
    if (!user) {
      // @ts-ignore
      user = await databaseClient.get(userKeySrc);
      if (user) report.note = "User found at src/content/users/";
    }
  } catch (readError: any) {
    report.readError = {
      message: readError.message,
      stack: readError.stack,
      details: JSON.stringify(readError),
    };
  }

  // 3. Try to read via RAW MongodbLevel Adapter (Bypass Tina/GitHub logic)
  try {
    // @ts-ignore
    const rawAdapter = new MongodbLevel({
      collectionName: "tinacms",
      dbName: "tinacms",
      mongoUri: process.env.MONGODB_URI as string,
    });
    // @ts-ignore
    const rawUser = await rawAdapter.get(userKey);
    // @ts-ignore
    const rawUserSrc = await rawAdapter.get(userKeySrc);

    report.rawMongoRead = "success";
    report.rawMongoUserFound = !!rawUser || !!rawUserSrc;

    // If raw works but client failed, use raw user for report
    if (!user && (rawUser || rawUserSrc)) {
      user = rawUser || rawUserSrc;
      report.note = rawUser
        ? "User found via RAW adapter (content/)"
        : "User found via RAW adapter (src/content/)";
    }

    // 3. Password Validation (Only if user found)
    if (user) {
      // Parse user if it's a string (raw adapter returns string)
      if (typeof user === "string") {
        try {
          user = JSON.parse(user);
        } catch (e) {
          // ignore
        }
      }

      if (user.password) {
        const isMatch = await bcrypt.compare("password123", user.password);
        report.passwordCheck = {
          status: isMatch ? "success" : "failed",
          message: isMatch
            ? "Password matches 'password123'"
            : "Password does NOT match 'password123'",
        };
      } else {
        report.passwordCheck = {
          status: "skipped",
          reason: "User object has no password field",
        };
      }
    } else {
      report.passwordCheck = {
        status: "skipped",
        reason: "No user found to check",
      };
    }
  } catch (rawError: any) {
    report.rawMongoRead = "failed";
    report.rawMongoError = {
      message: rawError.message,
      stack: rawError.stack,
    };
  }

  // 5. Write Test (Try to write a small file to DB)
  // Use a valid collection path (src/content/users) to avoid schema errors
  try {
    const testKey = "src/content/users/diagnostic-test.json";
    // @ts-ignore
    await databaseClient.put(
      testKey,
      JSON.stringify({
        test: true,
        date: new Date().toISOString(),
        username: "diagnostic-test",
        role: "admin",
        password: "none",
      }),
    );
    report.writeTest = "success";
    // Clean up
    // @ts-ignore
    // await databaseClient.del(testKey);
  } catch (writeError: any) {
    report.writeTest = "failed";
    report.writeError = {
      message: writeError.message,
      stack: writeError.stack,
      details: JSON.stringify(writeError), // Capture all properties
    };
  }

  // 6. Inspect Auth Options (Debug 401)
  if (authOptions) {
    // @ts-ignore
    report.authDebug = {
      // @ts-ignore
      providers: authOptions.providers?.map((p: any) => p.id || p.name),
      // @ts-ignore
      secretDefined: !!authOptions.secret,
      // @ts-ignore
      debug: authOptions.debug,
      // @ts-ignore
      credentialsProviderImported: !!CredentialsProvider,
    };
  }

  // Handle case where data is returned as string (JSON)
  if (user && typeof user === "string") {
    try {
      user = JSON.parse(user);
    } catch (e) {
      console.warn("Failed to parse user data as JSON:", e);
    }
  }

  report.connection =
    user || report.writeTest === "success" ? "success" : "failed";
  report.userFound = !!user;
  report.userData = user ? { username: user.username, role: user.role } : null; // Don't return password

  res.json(report);
});

const tinaHandler = TinaNodeBackend({
  authProvider: isLocal
    ? LocalBackendAuthProvider()
    : AuthJsBackendAuthProvider({
        // @ts-ignore
        authOptions,
      }),
  databaseClient,
});

app.all("*", async (req, res) => {
  try {
    if (!req) {
      console.error("Request object is undefined inside Express handler");
      res.status(500).json({ error: "Request object is undefined" });
      return;
    }
    console.log("Req URL in Express:", req.url);
    console.log("Req Method in Express:", req.method);
    console.log("Req Headers in Express:", JSON.stringify(req.headers));

    // @ts-ignore
    await tinaHandler(req, res);
  } catch (e: any) {
    console.error("Error inside tinaHandler wrapper:", e);
    res.status(500).json({ error: e.message || "Internal Server Error" });
  }
});

export const handler = serverless(app, {
  request: (req: any, event: any, context: any) => {
    console.log("Serverless Request created");
    console.log("Req URL:", req.url);
    console.log("Req method:", req.method);
  },
});
