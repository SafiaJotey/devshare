import { Router } from "express";
import UserController from "./user.controller";
import UserValidation from "./user.validation";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";

// ─── Auth Routes (/api/v1/auth) ───────────────────────────────────────────────

const authRouter: Router = Router();

authRouter.post(
  "/register",
  validateRequest(UserValidation.registerValidationSchema),
  UserController.register
);

authRouter.post(
  "/login",
  validateRequest(UserValidation.loginValidationSchema),
  UserController.login
);

authRouter.post(
  "/social-login",
  validateRequest(UserValidation.socialLoginValidationSchema),
  UserController.socialLogin
);

authRouter.post("/refresh-token", UserController.refreshToken);

authRouter.post("/logout", UserController.logout);

export const AuthRoutes: Router = authRouter;

// ─── User Routes (/api/v1/users) ──────────────────────────────────────────────

const userRouter: Router = Router();

userRouter.get("/me", auth(), UserController.getMe);

userRouter.patch(
  "/profile",
  auth(),
  validateRequest(UserValidation.updateProfileValidationSchema),
  UserController.updateProfile
);

userRouter.patch(
  "/profile/avatar",
  auth(),
  validateRequest(UserValidation.avatarUploadValidationSchema),
  UserController.updateAvatar
);

userRouter.patch(
  "/change-password",
  auth(),
  validateRequest(UserValidation.changePasswordValidationSchema),
  UserController.changePassword
);

export const UserRoutes: Router = userRouter;
export default UserRoutes;
