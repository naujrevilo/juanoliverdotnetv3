import express from "express";
import cookieParser from "cookie-parser";
import { TinaNodeBackend, LocalBackendAuthProvider } from "@tinacms/datalayer";
import { AuthJsBackendAuthProvider, TinaAuthJSOptions } from "tinacms-authjs";
import databaseClient from "../../tina/database";
import dotenv from "dotenv";
import serverless from "serverless-http";
// @ts-ignore
import * as mongodbLevelPkgImport from "mongodb-level";

dotenv.config();

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

const authOptions = isLocal
  ? undefined
  : TinaAuthJSOptions({
      databaseClient,
      secret: (process.env.NEXTAUTH_SECRET || "secret").trim(),
      debug: true,
    });

// @ts-ignore
if (authOptions) {
  // @ts-ignore
  authOptions.trustHost = true;
}

// Ensure NEXTAUTH_URL is clean (trim spaces that might cause errors)
if (process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = process.env.NEXTAUTH_URL.trim();
}

// Diagnostic route
app.get("/api/tina/test-db", async (req, res) => {
  const report: any = {
    env: {
      MONGODB_URI_DEFINED: !!process.env.MONGODB_URI,
      MONGODB_URI_LENGTH: process.env.MONGODB_URI?.length,
      NEXTAUTH_SECRET_DEFINED: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_URL_LENGTH: process.env.NEXTAUTH_URL?.length,
      GITHUB_TOKEN_DEFINED: !!process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
      GITHUB_OWNER: process.env.GITHUB_OWNER,
      GITHUB_REPO: process.env.GITHUB_REPO,
      GITHUB_BRANCH: process.env.GITHUB_BRANCH,
      TINA_PUBLIC_IS_LOCAL: process.env.TINA_PUBLIC_IS_LOCAL,
    },
  };

  const userKey = "content/users/juanoliver.json";

  // 1. Try to read the user via databaseClient (Official Path)
  // @ts-ignore
  let user: any = null;
  try {
    // @ts-ignore
    user = await databaseClient.get(userKey);
  } catch (readError: any) {
    report.readError = {
      message: readError.message,
      stack: readError.stack,
      details: JSON.stringify(readError),
    };
  }

  // 2. Try to read via RAW MongodbLevel Adapter (Bypass Tina/GitHub logic)
  try {
    // @ts-ignore
    const rawAdapter = new MongodbLevel({
      collectionName: "tinacms",
      dbName: "tinacms",
      mongoUri: process.env.MONGODB_URI as string,
    });
    // @ts-ignore
    const rawUser = await rawAdapter.get(userKey);
    report.rawMongoRead = "success";
    report.rawMongoUserFound = !!rawUser;
    // If raw works but client failed, use raw user for report
    if (!user && rawUser) {
      user = rawUser;
      report.note = "User found via RAW adapter but failed via DatabaseClient";
    }
  } catch (rawError: any) {
    report.rawMongoRead = "failed";
    report.rawMongoError = {
      message: rawError.message,
      stack: rawError.stack,
    };
  }

  // 3. Try to WRITE a test key to verify connectivity/permissions
  const testKey = "content/debug/netlify-test.json";
  const testValue = { timestamp: new Date().toISOString(), from: "netlify" };
  try {
    // @ts-ignore
    await databaseClient.put(testKey, testValue);
    report.writeTest = "success";
  } catch (writeError: any) {
    report.writeTest = "failed";
    report.writeError = {
      message: writeError.message,
      stack: writeError.stack,
      details: JSON.stringify(writeError),
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
