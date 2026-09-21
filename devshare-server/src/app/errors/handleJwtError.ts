import { JsonWebTokenError, TokenExpiredError, NotBeforeError } from "jsonwebtoken";
import { IErrorResponse } from "./handleZodError";

/**
 * Handles JWT-specific errors with precise, informative messages.
 * Distinguishes between expired tokens, invalid signatures, and timing errors.
 */
const handleJwtError = (
  err: JsonWebTokenError | TokenExpiredError | NotBeforeError
): IErrorResponse => {
  let message = "Invalid authentication token. Please log in again.";

  if (err instanceof TokenExpiredError) {
    message = "Your session has expired. Please log in again to continue.";
  } else if (err instanceof NotBeforeError) {
    message = "Authentication token is not yet valid. Please try again.";
  } else if (err instanceof JsonWebTokenError) {
    if (err.message === "invalid signature") {
      message = "Token signature is invalid. Please log in again.";
    } else if (err.message === "jwt malformed") {
      message = "Malformed authentication token. Please log in again.";
    }
  }

  return {
    statusCode: 401,
    message,
    errorSources: [
      {
        path: "authorization",
        message,
      },
    ],
  };
};

export default handleJwtError;
