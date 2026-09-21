import { MongoServerError } from "mongodb";
import { IErrorResponse } from "./handleZodError";

/**
 * Handles MongoDB duplicate key errors (error code 11000).
 * Extracts the conflicting field name from keyPattern or keyValue
 * and returns a human-readable 409 Conflict response.
 */
const handleMongoError = (err: MongoServerError): IErrorResponse => {
  // Extract the first conflicting field name
  const field =
    Object.keys(err.keyPattern || err.keyValue || {})[0] || "Field";

  // Capitalize field name for readability
  const fieldLabel = field.charAt(0).toUpperCase() + field.slice(1);

  return {
    statusCode: 409,
    message: `${fieldLabel} already exists`,
    errorSources: [
      {
        path: field,
        message: `An account with this ${field} already exists. Please use a different ${field} or log in.`,
      },
    ],
  };
};

export default handleMongoError;
