import { Response, Request, NextFunction, RequestHandler } from "express";

/**
 * catchAsync — wraps an async route handler and forwards any rejected promise
 * to Express's next() error chain instead of causing an unhandled rejection.
 */
export const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/** Optional pagination metadata for list responses */
export interface IPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IApiResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: T;
  meta?: IPaginationMeta;
}

/**
 * sendResponse — standardized JSON response helper.
 * Tokens are intentionally NOT included in the response body;
 * they are set as HTTP-only cookies by the controller.
 */
export const sendResponse = <T>(res: Response, data: IApiResponse<T>): void => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message || "Operation completed successfully",
    ...(data.meta !== undefined && { meta: data.meta }),
    ...(data.data !== undefined && { data: data.data }),
  });
};
