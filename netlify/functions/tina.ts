import { TinaNodeBackend, LocalBackendAuthProvider } from "@tinacms/datalayer";
import { AuthJsBackendAuthProvider, TinaAuthJSOptions } from "tinacms-authjs";
import databaseClient from "../../tina/database";

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

const handler = TinaNodeBackend({
  authProvider: isLocal
    ? LocalBackendAuthProvider()
    : AuthJsBackendAuthProvider({
        authOptions: TinaAuthJSOptions({
          databaseClient,
          secret: process.env.NEXTAUTH_SECRET || "secret",
        }),
      }),
  databaseClient,
});

export const handler = async (req: any, context: any) => {
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

    const result = await handler(req, context);
    return result;
  } catch (e: any) {
    console.error("Tina Function Error:", e);
    return new Response(
      JSON.stringify({ error: e.message || "Unknown error" }),
      { status: 500 },
    );
  }
};
