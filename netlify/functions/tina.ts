import { TinaNodeBackend, LocalBackendAuthProvider } from "@tinacms/datalayer";
import { AuthJsBackendAuthProvider, TinaAuthJSOptions } from "tinacms-authjs";
import databaseClient from "../../tina/database";
import serverless from "serverless-http";

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

const serverlessHandler = serverless(tinaHandler, {
  request: (req: any, event: any, context: any) => {
    console.log("Serverless Request created");
    console.log("Req URL:", req.url);
    console.log("Req method:", req.method);
  },
});

export const handler = async (event: any, context: any) => {
  try {
    console.log("Tina Function Start");
    console.log("Branch:", process.env.GITHUB_BRANCH);
    console.log("Repo:", process.env.GITHUB_REPO);
    console.log("Has Mongo URI:", !!process.env.MONGODB_URI);
    console.log(
      "Has GitHub Token:",
      !!process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
    );
    console.log("Is Local:", isLocal);

    return await serverlessHandler(event, context);
  } catch (e: any) {
    console.error("Tina Function Error:", e);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message || "Unknown error" }),
    };
  }
};
