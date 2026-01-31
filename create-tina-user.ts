import { createDatabase } from "@tinacms/datalayer";
// @ts-ignore
import mongodbLevelPkg from "mongodb-level";
// @ts-ignore
import gitProviderPkg from "tinacms-gitprovider-github";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

const { MongodbLevel } = mongodbLevelPkg;
const { GitHubProvider } = gitProviderPkg;

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("Error: MONGODB_URI environment variable is not set.");
  process.exit(1);
}

const adapter = new MongodbLevel({
  collectionName: "tinacms",
  dbName: "tinacms",
  mongoUri: MONGO_URI,
});

const createUser = async () => {
  const username = "juanoliver";
  const password = "password123";

  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user in both paths to ensure compatibility with backend/frontend mismatch
  // 1. Standard Tina path (backend might expect this)
  const key1 = `content/users/${username}.json`;
  // 2. Project source path (frontend config will use this)
  const key2 = `src/content/users/${username}.json`;

  const value = {
    username,
    password: hashedPassword,
    role: "admin",
  };

  try {
    // @ts-ignore
    await adapter.put(key1, JSON.stringify(value));
    console.log(`User created at '${key1}'`);

    // @ts-ignore
    await adapter.put(key2, JSON.stringify(value));
    console.log(`User created at '${key2}'`);

    console.log(`Password set to: ${password}`);
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

createUser();
