import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync, sendResponse } from "../../utils/response";
import UserService from "./user.service";
import UserValidation from "./user.validation";
import config from "../../../config";

const cookieOptions = {
  secure: config.env === "production",
  httpOnly: true,
  sameSite: (config.env === "production" ? "none" : "lax") as "none" | "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const register = catchAsync(async (req: Request, res: Response) => {
  const validatedData = UserValidation.registerValidationSchema.parse(req.body);
  const result = await UserService.registerUser(validatedData);

  res.cookie("token", result.token, cookieOptions);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User registered successfully",
    token: result.token,
    data: result.user,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const validatedData = UserValidation.loginValidationSchema.parse(req.body);
  const result = await UserService.loginUser(validatedData);

  res.cookie("token", result.token, cookieOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    token: result.token,
    data: result.user,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await UserService.getMe(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile retrieved successfully",
    data: result,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const validatedData = UserValidation.updateProfileValidationSchema.parse(req.body);
  const result = await UserService.updateProfile(userId, validatedData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile updated successfully",
    data: result,
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("token", {
    secure: config.env === "production",
    httpOnly: true,
    sameSite: (config.env === "production" ? "none" : "lax") as "none" | "lax",
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged out successfully",
  });
});

export const UserController = {
  register,
  login,
  getMe,
  updateProfile,
  logout,
};

export default UserController;
