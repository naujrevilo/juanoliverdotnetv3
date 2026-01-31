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
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
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

    // @ts-ignore
    const user = await databaseClient.get(userKey);

    report.connection = "success";
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
