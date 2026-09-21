import { Request, Response, NextFunction } from "express";
import { ZodTypeAny } from "zod";

/**
 * validateRequest — generic Zod validation middleware factory.
 *
 * Usage in route:
 *   router.post("/register", validateRequest(UserValidation.registerSchema), UserController.register)
 *
 * - Parses req.body against the given Zod schema
 * - Replaces req.body with the parsed (and sanitized) output
 * - On failure, passes a ZodError to next() → handled by globalErrorHandler
 */
const validateRequest = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validateRequest;

