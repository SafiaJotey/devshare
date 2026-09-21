import { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { JsonWebTokenError, TokenExpiredError, NotBeforeError } from "jsonwebtoken";
import { MongoServerError } from "mongodb";
import AppError from "../errors/AppError";
import handleZodError from "../errors/handleZodError";
import handleMongoError from "../errors/handleMongoError";
import handleJwtError from "../errors/handleJwtError";
import config from "../../config";

// ─── Global Error Handler ─────────────────────────────────────────────────────

/**
 * Centralized Express error handler. Every unhandled error (thrown or
 * passed via next(err)) lands here and is formatted into a consistent shape:
 *
 * {
 *   success: false,
 *   message: "...",
 *   errorSources: [{ path: "...", message: "..." }],
 *   stack: "..." // dev only
 * }
 */
export const globalErrorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let errorSources: Array<{ path: string; message: string }> = [
    { path: "", message: "Internal Server Error" },
  ];

  // ── Zod validation error ──────────────────────────────────────────────────
  if (err instanceof ZodError) {
    const formatted = handleZodError(err);
    statusCode = formatted.statusCode;
    message = formatted.message;
    errorSources = formatted.errorSources;
  }

  // ── MongoDB duplicate key error ───────────────────────────────────────────
  else if (err instanceof MongoServerError && err.code === 11000) {
    const formatted = handleMongoError(err);
    statusCode = formatted.statusCode;
    message = formatted.message;
    errorSources = formatted.errorSources;
  }

  // ── JWT errors (token expired, invalid, malformed) ────────────────────────
  else if (
    err instanceof TokenExpiredError ||
    err instanceof NotBeforeError ||
    err instanceof JsonWebTokenError
  ) {
    const formatted = handleJwtError(err);
    statusCode = formatted.statusCode;
    message = formatted.message;
    errorSources = formatted.errorSources;
  }

  // ── Operational AppError (anticipated HTTP errors) ────────────────────────
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSources = [{ path: "", message: err.message }];
  }

  // ── Generic Error (unexpected programmer errors) ──────────────────────────
  else if (err instanceof Error) {
    message = err.message;
    errorSources = [{ path: "", message: err.message }];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.env === "development" ? (err instanceof Error ? err.stack : undefined) : undefined,
  });
};

export default globalErrorHandler;
