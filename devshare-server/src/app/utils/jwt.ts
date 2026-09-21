import jwt, { SignOptions, JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import config from "../../config";
import { IJwtPayload } from "../modules/user/user.interface";

// ─── Access Token ─────────────────────────────────────────────────────────────

/**
 * Generates a short-lived access token (default: 15 minutes).
 * Used for API authorization on every protected request.
 */
export const generateAccessToken = (payload: IJwtPayload): string => {
  const options: SignOptions = {
    expiresIn: config.jwt.access_expires_in as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, config.jwt.access_secret, options);
};

/**
 * Verifies an access token. Throws JsonWebTokenError or TokenExpiredError
 * (both propagate to handleJwtError in globalErrorHandler).
 */
export const verifyAccessToken = (token: string): IJwtPayload => {
  return jwt.verify(token, config.jwt.access_secret) as IJwtPayload;
};

// ─── Refresh Token ────────────────────────────────────────────────────────────

/**
 * Generates a long-lived refresh token (default: 7 days).
 * Stored ONLY as an HTTP-only cookie and hashed in the database.
 */
export const generateRefreshToken = (payload: IJwtPayload): string => {
  const options: SignOptions = {
    expiresIn: config.jwt.refresh_expires_in as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, config.jwt.refresh_secret, options);
};

/**
 * Verifies a refresh token using the separate refresh secret.
 * Throws JsonWebTokenError or TokenExpiredError on failure.
 */
export const verifyRefreshToken = (token: string): IJwtPayload => {
  return jwt.verify(token, config.jwt.refresh_secret) as IJwtPayload;
};

// ─── Token Hashing ───────────────────────────────────────────────────────────

/**
 * Hashes a refresh token with SHA-256 for safe database storage.
 * Never store raw refresh tokens in the DB — only their hash.
 */
export const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

// ─── Password Utilities ───────────────────────────────────────────────────────

export const hashPassword = async (plainPassword: string): Promise<string> => {
  return bcrypt.hash(plainPassword, config.bcrypt_salt_rounds);
};

export const comparePassword = async (
  plainPassword: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hash);
};

// ─── Re-export for convenience ────────────────────────────────────────────────
export { JsonWebTokenError, TokenExpiredError };
