import express from "express";
import cookieParser from "cookie-parser";
import { TinaNodeBackend, LocalBackendAuthProvider } from "@tinacms/datalayer";
import { AuthJsBackendAuthProvider, TinaAuthJSOptions } from "tinacms-authjs";
import databaseClient from "../../tina/database";
import serverless from "serverless-http";
// @ts-ignore
import * as mongodbLevelPkg from "mongodb-level";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

const authOptions = isLocal
  ? undefined
  : TinaAuthJSOptions({
      databaseClient,
      secret: process.env.NEXTAUTH_SECRET || "secret",
      debug: true,
    });

// @ts-ignore
if (authOptions) {
  // @ts-ignore
  authOptions.trustHost = true;
}

// Diagnostic route to check DB connection and Env Vars
app.get("/api/tina/test-db", async (req, res) => {
  const uri = process.env.MONGODB_URI;
  const secret = process.env.NEXTAUTH_SECRET;
  const report: any = {
    env: {
      MONGODB_URI_DEFINED: !!uri,
      MONGODB_URI_LENGTH: uri ? uri.length : 0,
      NEXTAUTH_SECRET_DEFINED: !!secret,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL
        ? `"${process.env.NEXTAUTH_URL}"`
        : "undefined",
      NEXTAUTH_URL_LENGTH: process.env.NEXTAUTH_URL
        ? process.env.NEXTAUTH_URL.length
        : 0,
      GITHUB_TOKEN_DEFINED: !!process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
      GITHUB_OWNER: process.env.GITHUB_OWNER,
      GITHUB_REPO: process.env.GITHUB_REPO,
      TINA_PUBLIC_IS_LOCAL: process.env.TINA_PUBLIC_IS_LOCAL,
    },
    connection: "pending",
    userFound: false,
    error: null,
  };

  try {
    if (!uri) throw new Error("MONGODB_URI is missing");

    // Use the existing databaseClient to test connection
    // This verifies the actual client configuration used by Tina
    const userKey = "content/users/juanoliver.json";

    // 1. Try to read the user
    // @ts-ignore
    let user: any = null;
    try {
      // @ts-ignore
      user = await databaseClient.get(userKey);
    } catch (readError: any) {
      console.warn("Read failed:", readError.message);
      report.readError = {
        message: readError.message,
        stack: readError.stack,
        details: JSON.stringify(readError),
      };
    }

    // 2. Try to WRITE a test key to verify connectivity/permissions
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
    report.userData = user
      ? { username: user.username, role: user.role }
      : null; // Don't return password
  } catch (e: any) {
    report.connection = "failed";
    report.error = e.message;
  }

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
