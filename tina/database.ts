import { createDatabase, createLocalDatabase } from "@tinacms/datalayer";
// @ts-ignore
import * as mongodbLevelPkgImport from "mongodb-level";
// @ts-ignore
import * as gitProviderPkgImport from "tinacms-gitprovider-github";

// Sanitize environment variables (remove quotes if present)
const sanitize = (val: string | undefined) => {
  return val ? val.replace(/['"`]/g, "").trim() : "";
};

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

const isLocal = sanitize(process.env.TINA_PUBLIC_IS_LOCAL) === "true";

if (!isLocal) {
  console.log("Initializing Tina Database (Production Mode)");
  console.log("Branch:", sanitize(process.env.GITHUB_BRANCH || "main"));
  console.log("Owner:", sanitize(process.env.GITHUB_OWNER));
  console.log("Repo:", sanitize(process.env.GITHUB_REPO));
  const token = sanitize(process.env.GITHUB_PERSONAL_ACCESS_TOKEN);
  console.log("Token Length:", token.length);
  console.log("Mongo URI Length:", sanitize(process.env.MONGODB_URI).length);
}

export default isLocal
  ? createLocalDatabase()
  : createDatabase({
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
    });
