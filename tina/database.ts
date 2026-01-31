import { createDatabase, createLocalDatabase } from "@tinacms/datalayer";
// @ts-ignore
import mongodbLevelPkg from "mongodb-level";
// @ts-ignore
import gitProviderPkg from "tinacms-gitprovider-github";

const { MongodbLevel } = mongodbLevelPkg;
const { GitHubProvider } = gitProviderPkg;

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
