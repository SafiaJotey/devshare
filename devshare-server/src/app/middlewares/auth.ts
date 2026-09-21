import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import AppError from "../errors/AppError";
import { verifyToken } from "../utils/jwt";
import { IJwtPayload } from "../modules/user/user.interface";

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: IJwtPayload;
    }
  }
}

export const auth = (...requiredRoles: Array<"user" | "admin">) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let token: string | undefined;

      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      } else if (req.cookies?.token) {
        token = req.cookies.token;
      } else if (req.cookies?.accessToken) {
        token = req.cookies.accessToken;
      }

      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized to access this resource");
      }

      let decoded: IJwtPayload;
      try {
        decoded = verifyToken(token);
      } catch (err) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired authentication token");
      }

      // Check role permissions if specified
      if (requiredRoles.length > 0 && !requiredRoles.includes(decoded.role)) {
        throw new AppError(httpStatus.FORBIDDEN, "Forbidden: You do not have permission to perform this action");
      }

      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
