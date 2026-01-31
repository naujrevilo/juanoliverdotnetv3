import pkg from "mongodb-level";
const { MongodbLevel } = pkg;
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import dns from "dns";

// Configurar dotenv para leer el .env en la raíz
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

// Forzar el uso del servidor DNS de Google (8.8.8.8) para evitar bloqueos del ISP
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const run = async () => {
  if (!process.env.MONGODB_URI) {
    console.error("Error: MONGODB_URI is missing in .env");
    process.exit(1);
  }

  // Hash the password
  const username = "admin"; // Cambia esto si quieres otro usuario
  const password = "password123"; // Cambia esto por tu contraseña inicial
  const hashedPassword = await bcrypt.hash(password, 10);

  const databaseAdapter = new MongodbLevel({
    collectionName: "tinacms",
    dbName: "tinacms",
    mongoUri: process.env.MONGODB_URI,
  });

  // We connect directly to the adapter to avoid Git operations for the user
  // (We don't want to commit the user to GitHub!)
  // The key format for tinacms-authjs users is usually "content/users/<username>.json"
  const key = `content/users/${username}.json`;
  const value = {
    username,
    password: hashedPassword,
    name: "Admin User",
    email: "admin@example.com",
    _template: "user", // This matches the collection name "user"
  };

  console.log(`Creating user '${username}' in MongoDB...`);

  try {
    await databaseAdapter.put(key, JSON.stringify(value));
    console.log("✅ User created successfully!");
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log("\nNow try logging in at /admin");
  } catch (e) {
    console.error("❌ Error creating user:", e);
  }
};

run();
