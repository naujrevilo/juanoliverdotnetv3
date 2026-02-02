import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const createUserFile = async () => {
  const username = "juanoliver";
  const password = "password123";

  const hashedPassword = await bcrypt.hash(password, 10);

  const dir = path.join(process.cwd(), "content", "users");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filePath = path.join(dir, `${username}.json`);
  const value = {
    username,
    password: hashedPassword,
    role: "admin",
  };

  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
  console.log(`User file created at ${filePath}`);
};

createUserFile();
