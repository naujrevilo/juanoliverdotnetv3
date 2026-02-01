import "./env-setup"; // MUST BE FIRST
import express from "express";
import serverless from "serverless-http";
// @ts-ignore
import * as mongodbLevelPkgImport from "mongodb-level";
import bcrypt from "bcryptjs";
import databaseClient from "../../tina/database";

// @ts-ignore
const mongodbLevelPkg = mongodbLevelPkgImport as any;
// @ts-ignore
const MongodbLevel =
  mongodbLevelPkg.MongodbLevel ||
  mongodbLevelPkg.default?.MongodbLevel ||
  mongodbLevelPkg.default ||
  mongodbLevelPkg;

const app = express();
app.use(express.json());

// Helper to get raw adapter
const getRawAdapter = () => {
  // @ts-ignore
  return new MongodbLevel({
    collectionName: "tinacms",
    dbName: "tinacms",
    mongoUri: process.env.MONGODB_URI as string,
  });
};

app.get("/api/diagnostics", async (req, res) => {
  const report: any = {
    env: {
      MONGODB_URI_DEFINED: !!process.env.MONGODB_URI,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      GITHUB_TOKEN_DEFINED: !!process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
    },
  };

  const userKey = "content/users/juanoliver.json";
  const userKeySrc = "src/content/users/juanoliver.json";

  // 1. Check Standard Client
  try {
    // @ts-ignore
    const user = await databaseClient.get(userKey);
    report.standardClient = { found: !!user, key: userKey };
  } catch (e: any) {
    report.standardClient = { found: false, error: e.message };
  }

  // 2. Check Raw Adapter
  try {
    const rawAdapter = getRawAdapter();
    // @ts-ignore
    const rawUser = await rawAdapter.get(userKey);
    // @ts-ignore
    const rawUserSrc = await rawAdapter.get(userKeySrc);
    report.rawAdapter = {
      foundContent: !!rawUser,
      foundSrcContent: !!rawUserSrc,
    };

    // Check Password if found
    const user = rawUser || rawUserSrc;
    if (user) {
      let userData = typeof user === "string" ? JSON.parse(user) : user;
      if (userData.password) {
        const isMatch = await bcrypt.compare("password123", userData.password);
        report.passwordCheck = isMatch ? "MATCH" : "MISMATCH";
      }
    }
  } catch (e: any) {
    report.rawAdapter = { error: e.message };
  }

  // 3. User Reset
  if (req.query.reset_user === "true") {
    try {
      const rawAdapter = getRawAdapter();
      const hashedPassword = await bcrypt.hash("password123", 10);
      const newUser = {
        username: "juanoliver",
        password: hashedPassword,
        email: "juan.oliver@example.com",
        role: "admin",
        image: "",
      };
      // @ts-ignore
      await rawAdapter.put(userKey, JSON.stringify(newUser));
      // @ts-ignore
      await rawAdapter.put(userKeySrc, JSON.stringify(newUser));
      report.reset = "SUCCESS";
    } catch (e: any) {
      report.reset = { error: e.message };
    }
  }

  res.json(report);
});

export const handler = serverless(app);
