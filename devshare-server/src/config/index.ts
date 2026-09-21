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
    // Access token: short-lived, used for API authorization
    access_secret:
      process.env.JWT_ACCESS_SECRET ||
      process.env.JWT_SECRET ||
      "devshare_access_secret_jwt_key_2026",
    access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    // Refresh token: long-lived, stored hashed in DB, used to rotate access tokens
    refresh_secret:
      process.env.JWT_REFRESH_SECRET ||
      "devshare_refresh_secret_jwt_key_2026_rotate",
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS
    ? parseInt(process.env.BCRYPT_SALT_ROUNDS, 10)
    : 12,
};

export default config;
