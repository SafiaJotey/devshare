/**
 * AppError — Operational HTTP error.
 * `isOperational = true` marks errors we anticipated (bad input, not found, unauthorized).
 * Errors without this flag (or with false) are programmer bugs — crash-worthy.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true, stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
