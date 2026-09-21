import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import AppError from "../errors/AppError";
import { verifyAccessToken } from "../utils/jwt";
import { IJwtPayload } from "../modules/user/user.interface";

// ─── Extend Express Request ───────────────────────────────────────────────────

declare global {
  namespace Express {
    interface Request {
      user?: IJwtPayload;
    }
  }
}

// ─── Auth Middleware ──────────────────────────────────────────────────────────

/**
 * auth() — JWT access token authentication middleware.
 *
 * Token extraction order:
 *   1. Authorization: Bearer <token>  (API clients, Postman, mobile)
 *   2. accessToken cookie             (browser clients)
 *
 * Optionally accepts required roles; throws 403 Forbidden if user lacks permission.
 *
 * Usage:
 *   router.get("/me", auth(), UserController.getMe)
 *   router.delete("/admin/user/:id", auth("admin"), AdminController.deleteUser)
 */
export const auth = (...requiredRoles: Array<"user" | "admin">) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let token: string | undefined;

      // 1. Check Authorization header (API clients / mobile apps)
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }

      // 2. Fall back to HTTP-only cookie (browser clients)
      if (!token && req.cookies?.accessToken) {
        token = req.cookies.accessToken;
      }

      if (!token) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "Access denied. No authentication token provided."
        );
      }

      // verifyAccessToken throws JsonWebTokenError / TokenExpiredError on failure
      // These are caught and forwarded to globalErrorHandler → handleJwtError
      const decoded = verifyAccessToken(token);

      // Role-based access control
      if (requiredRoles.length > 0 && !requiredRoles.includes(decoded.role)) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "Forbidden. You do not have permission to perform this action."
        );
      }

      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
