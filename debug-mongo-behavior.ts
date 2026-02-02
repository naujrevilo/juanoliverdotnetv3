
import { createDatabase } from "@tinacms/datalayer";
// @ts-ignore
import mongodbLevelPkg from "mongodb-level";
import dotenv from "dotenv";

const { MongodbLevel } = mongodbLevelPkg;

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

const runTest = async () => {
  console.log("--- Starting MongoDB Level Behavior Test ---");
  const keyString = "debug/test-string";
  const valString = JSON.stringify({ type: "string", val: 123 });
  
  const keyObj = "debug/test-object";
  const valObj = { type: "object", val: 456 };

  try {
    // 1. Test String Storage
    console.log(`Writing String to ${keyString}...`);
    // @ts-ignore
    await adapter.put(keyString, valString);
    // @ts-ignore
    const readString = await adapter.get(keyString);
    console.log("Read String Result:", readString);
    console.log("Type of Read String:", typeof readString);

    // 2. Test Object Storage
    console.log(`\nWriting Object to ${keyObj}...`);
    // @ts-ignore
    await adapter.put(keyObj, valObj);
    // @ts-ignore
    const readObj = await adapter.get(keyObj);
    console.log("Read Object Result:", readObj);
    console.log("Type of Read Object:", typeof readObj);
    
    // 3. Check Real User
    const userKey = "content/users/juanoliver.json";
    console.log(`\nChecking Real User at ${userKey}...`);
    // @ts-ignore
    const user = await adapter.get(userKey);
    console.log("Real User Result:", user);
    console.log("Type of Real User:", typeof user);

  } catch (error) {
    console.error("Test Error:", error);
  }
};

runTest();
