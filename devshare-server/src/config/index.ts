import dotenv from "dotenv";
import path from "path";

// Prioritize .env.local, fallback to .env
dotenv.config({ path: path.join(process.cwd(), ".env.local") });
dotenv.config({ path: path.join(process.cwd(), ".env") });

export const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  database_url: process.env.DB || process.env.DATABASE_URL || "",
  jwt: {
    secret: process.env.JWT_SECRET || "devshare_super_secret_jwt_key_2026",
    expires_in: process.env.JWT_EXPIRES_IN || "7d",
  },
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS ? parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) : 10,
};

export default config;
