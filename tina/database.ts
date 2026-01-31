import { createDatabase, createLocalDatabase } from "@tinacms/datalayer";
// @ts-ignore
import * as mongodbLevelPkgImport from "mongodb-level";
// @ts-ignore
import * as gitProviderPkgImport from "tinacms-gitprovider-github";

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

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

if (!isLocal) {
  console.log("Initializing Tina Database (Production Mode)");
  console.log("Branch:", (process.env.GITHUB_BRANCH || "main").trim());
  console.log("Owner:", (process.env.GITHUB_OWNER || "").trim());
  console.log("Repo:", (process.env.GITHUB_REPO || "").trim());
  const token = (process.env.GITHUB_PERSONAL_ACCESS_TOKEN || "").trim();
  console.log("Token Length:", token.length);
  console.log("Mongo URI Length:", (process.env.MONGODB_URI || "").length);
}

export default isLocal
  ? createLocalDatabase()
  : createDatabase({
      gitProvider: new GitHubProvider({
        branch: (process.env.GITHUB_BRANCH || "main").trim(),
        owner: (process.env.GITHUB_OWNER || "").trim(),
        repo: (process.env.GITHUB_REPO || "").trim(),
        token: (process.env.GITHUB_PERSONAL_ACCESS_TOKEN || "").trim(),
      }),
      databaseAdapter: new MongodbLevel({
        collectionName: "tinacms",
        dbName: "tinacms",
        mongoUri: (process.env.MONGODB_URI as string).trim(),
      }),
    });
