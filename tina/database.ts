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
const MongodbLevel = mongodbLevelPkg.MongodbLevel || mongodbLevelPkg.default?.MongodbLevel || mongodbLevelPkg.default || mongodbLevelPkg;
// @ts-ignore
const GitHubProvider = gitProviderPkg.GitHubProvider || gitProviderPkg.default?.GitHubProvider || gitProviderPkg.default || gitProviderPkg;


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
