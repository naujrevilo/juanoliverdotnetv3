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
    ...options,
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

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

// --- MONKEY PATCHES START ---

// Fix for "databaseClient.getToken is not a function" error
// This method is also called by TinaAuthJSOptions's default JWT callback
// @ts-ignore
if (!databaseClient.getToken) {
  // @ts-ignore
  databaseClient.getToken = async (key: string) => {
    console.log(
      `[Tina Fix] databaseClient.getToken called (mocked) with key: ${key}`,
    );

    // Try to find the user in the database using the key as username
    // We try both common paths
    const paths = [
      `content/users/${key}.json`,
      `src/content/users/${key}.json`,
    ];

    for (const path of paths) {
      try {
        // @ts-ignore
        const user = await databaseClient.get(path);
        if (user) {
          console.log(`[Tina Fix] getToken found user at ${path}`);
          return user;
        }
      } catch (e) {
        // Continue to next path
      }
    }

    console.log(`[Tina Fix] getToken could not find user for key: ${key}`);
    return null;
  };
}

// Fix for "databaseClient.isAuthorized is not a function" error
// @ts-ignore
if (!databaseClient.isAuthorized) {
  // @ts-ignore
  databaseClient.isAuthorized = async (session: any) => {
    console.log("[Tina Fix] databaseClient.isAuthorized called (mocked)");
    // Relaxed check: just ensure user object exists
    return !!session?.user;
  };
}

const originalGet = databaseClient.get.bind(databaseClient);
// @ts-ignore
databaseClient.get = async (key: string) => {
  try {
    // 1. Try standard client (GitHub + Level)
    const result = await originalGet(key);
    if (typeof result === "string") {
      try {
        return JSON.parse(result);
      } catch (e) {
        return result;
      }
    }
    return result;
  } catch (error: any) {
    // 2. If standard client fails, try Raw MongoDB Adapter
    console.log(
      `[Tina Fix] Standard .get failed for ${key}: ${error.message}. Trying Raw Adapter...`,
    );

    try {
      // @ts-ignore
      const rawAdapter = new MongodbLevel({
        collectionName: "tinacms",
        dbName: "tinacms",
        mongoUri: process.env.MONGODB_URI as string,
      });
      // @ts-ignore
      const rawResult = await rawAdapter.get(key);

      if (rawResult) {
        console.log(`[Tina Fix] Found ${key} in Raw Adapter!`);
        if (typeof rawResult === "string") {
          try {
            return JSON.parse(rawResult);
          } catch (e) {
            return rawResult;
          }
        }
        return rawResult;
      }
    } catch (rawError) {
      console.log(`[Tina Fix] Raw Adapter also failed for ${key}`);
    }

    throw error;
  }
};
// --- MONKEY PATCHES END ---

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

      let user = null;

      // 1. Try Standard Database Client
      try {
        // @ts-ignore
        user = await databaseClient.get(key1);
      } catch (e) {
        console.log(
          `[CustomAuth] User not found at ${key1} (error thrown), trying ${key2}`,
        );
      }

      if (!user) {
        try {
          // @ts-ignore
          user = await databaseClient.get(key2);
        } catch (e) {
          console.log(`[CustomAuth] User not found at ${key2} via DB Client.`);
        }
      }

      // 2. Fallback to RAW MongodbLevel Adapter (Bypass Tina/GitHub logic)
      if (!user) {
        console.log(
          "[CustomAuth] Standard DB client failed. Trying RAW MongoDB adapter...",
        );
        try {
          // @ts-ignore
          const rawAdapter = new MongodbLevel({
            collectionName: "tinacms",
            dbName: "tinacms",
            mongoUri: process.env.MONGODB_URI as string,
          });

          try {
            // @ts-ignore
            user = await rawAdapter.get(key1);
          } catch (e) {
            /* ignore */
          }

          if (!user) {
            try {
              // @ts-ignore
              user = await rawAdapter.get(key2);
            } catch (e) {
              /* ignore */
            }
          }

          if (user) {
            console.log("[CustomAuth] User FOUND via RAW MongoDB adapter!");
          }
        } catch (rawError) {
          console.error("[CustomAuth] RAW adapter error:", rawError);
        }
      }

      if (!user) {
        console.log(
          `[CustomAuth] User not found in DB (checked standard and raw)`,
        );
        return null;
      }

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

const tinaHandler = TinaNodeBackend({
  authProvider: isLocal
    ? LocalBackendAuthProvider()
    : AuthJsBackendAuthProvider({
        // @ts-ignore
        authOptions,
      }),
  databaseClient,
});

export const handler = serverless(tinaHandler);
