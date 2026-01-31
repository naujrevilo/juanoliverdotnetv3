import express from "express";
import cookieParser from "cookie-parser";
import { TinaNodeBackend, LocalBackendAuthProvider } from "@tinacms/datalayer";
import { AuthJsBackendAuthProvider, TinaAuthJSOptions } from "tinacms-authjs";
import databaseClient from "../../tina/database";
import serverless from "serverless-http";

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

if (authOptions) {
  authOptions.trustHost = true;
}

const tinaHandler = TinaNodeBackend({
  authProvider: isLocal
    ? LocalBackendAuthProvider()
    : AuthJsBackendAuthProvider({
        authOptions,
      }),
  databaseClient,
});

app.all("*", (req, res) => {
  tinaHandler(req, res);
});

export const handler = serverless(app, {
  request: (req: any, event: any, context: any) => {
    console.log("Serverless Request created");
    console.log("Req URL:", req.url);
    console.log("Req method:", req.method);
  },
});
