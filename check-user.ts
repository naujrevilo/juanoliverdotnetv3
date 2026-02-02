import databaseClient from "./tina/database";
import dotenv from "dotenv";

dotenv.config();

// Ensure we are checking the PRODUCTION database (MongoDB)
process.env.TINA_PUBLIC_IS_LOCAL = "false";

const verifyUser = async () => {
  const username = "juanoliver";
  const paths = [
    `content/users/${username}.json`,
    `src/content/users/${username}.json`,
  ];

  console.log(`Checking for user: ${username}`);

  for (const p of paths) {
    try {
      // @ts-ignore
      const user = await databaseClient.get(p);
      if (user) {
        console.log(`✅ FOUND at ${p}`);
        console.log("Raw content type:", typeof user);

        let parsedUser = user;
        if (typeof user === "string") {
          try {
            parsedUser = JSON.parse(user);
          } catch (e) {
            console.error("Error parsing JSON:", e);
          }
        }

        console.log("User data:", {
          ...parsedUser,
          password: parsedUser.password ? "****** (EXISTS)" : "MISSING",
        });
        return;
      } else {
        console.log(`❌ NOT FOUND at ${p}`);
      }
    } catch (e) {
      console.log(`❌ ERROR reading ${p}:`, e.message);
    }
  }
};

verifyUser();
