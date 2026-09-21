import { ZodError } from "zod";

export interface IErrorSource {
  path: string;
  message: string;
}

export interface IErrorResponse {
  statusCode: number;
  message: string;
  errorSources: IErrorSource[];
}

/**
 * Formats a ZodError into a structured error response.
 * Maps each Zod issue to { path, message } with the field path joined by dots.
 */
const handleZodError = (err: ZodError): IErrorResponse => {
  const errorSources: IErrorSource[] = err.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));

  return {
    statusCode: 400,
    message: "Validation Error",
    errorSources,
  };
};

export default handleZodError;
