import { Router } from "express";
import UserController from "./user.controller";
import auth from "../../middlewares/auth";

const router: Router = Router();

// Public Authentication Endpoints
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/logout", UserController.logout);

// Protected User Endpoints
router.get("/me", auth(), UserController.getMe);
router.patch("/profile", auth(), UserController.updateProfile);

export const UserRoutes: Router = router;
export default UserRoutes;
