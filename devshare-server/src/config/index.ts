import dotenv from "dotenv";
import path from "path";

// Prioritize .env.local, fallback to .env
dotenv.config({ path: path.join(process.cwd(), ".env.local") });
dotenv.config({ path: path.join(process.cwd(), ".env") });

export const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  database_url: process.env.DB || process.env.DATABASE_URL || "",

  // Client URLs for CORS
  client_urls: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "https://safia-dev-blog.vercel.app",
    process.env.CLIENT_URL,
    process.env.ADDITIONAL_CLIENT_URL,
  ].filter(Boolean) as string[],

  jwt: {
    access_secret:
      process.env.JWT_ACCESS_SECRET ||
      process.env.JWT_SECRET ||
      "devshare_access_secret_jwt_key_2026",
    access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    refresh_secret:
      process.env.JWT_REFRESH_SECRET ||
      "devshare_refresh_secret_jwt_key_2026_rotate",
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS
    ? parseInt(process.env.BCRYPT_SALT_ROUNDS, 10)
    : 10,
};

export default config;