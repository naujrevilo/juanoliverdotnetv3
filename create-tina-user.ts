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

  // Clave usada por tinacms-authjs por defecto cuando usa MongodbLevel
  // Formato: content/users/${username}.json
  const key = `content/users/${username}.json`;

  const value = {
    username,
    password: hashedPassword,
    role: "admin",
  };

  try {
    // @ts-ignore
    await adapter.put(key, value);
    console.log(`User '${username}' created successfully.`);
    console.log(`Password: ${password}`);
    console.log(
      `NOTE: Please change this password after logging in if possible, or update this script.`,
    );
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

createUser();
