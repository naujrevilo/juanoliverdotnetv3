import { createDatabase, createLocalDatabase } from "@tinacms/datalayer";
// @ts-ignore
import * as mongodbLevelPkg from "mongodb-level";
// @ts-ignore
import * as gitProviderPkg from "tinacms-gitprovider-github";

// @ts-ignore
const MongodbLevel = mongodbLevelPkg.MongodbLevel || mongodbLevelPkg.default?.MongodbLevel || mongodbLevelPkg.default;
// @ts-ignore
const GitHubProvider = gitProviderPkg.GitHubProvider || gitProviderPkg.default?.GitHubProvider || gitProviderPkg.default;

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

export default isLocal
  ? createLocalDatabase()
  : createDatabase({
      gitProvider: new GitHubProvider({
        branch: process.env.GITHUB_BRANCH || "main",
        owner: process.env.GITHUB_OWNER || "",
        repo: process.env.GITHUB_REPO || "",
        token: process.env.GITHUB_PERSONAL_ACCESS_TOKEN || "",
      }),
      databaseAdapter: new MongodbLevel({
        collectionName: "tinacms",
        dbName: "tinacms",
        mongoUri: process.env.MONGODB_URI as string,
      }),
    });
