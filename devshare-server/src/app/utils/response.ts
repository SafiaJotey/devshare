import { Response, Request, NextFunction, RequestHandler } from "express";

export const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

export interface IApiResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string;
  token?: string;
  data?: T;
}

export const sendResponse = <T>(res: Response, data: IApiResponse<T>): void => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message || "Operation completed successfully",
    ...(data.token && { token: data.token }),
    ...(data.data !== undefined && { data: data.data }),
  });
};
