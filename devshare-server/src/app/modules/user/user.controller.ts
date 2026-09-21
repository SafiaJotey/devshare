import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync, sendResponse } from "../../utils/response";
import UserService from "./user.service";
import config from "../../../config";

// ─── Cookie Helpers ───────────────────────────────────────────────────────────

const isProd = config.env === "production";

const accessTokenCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: (isProd ? "none" : "lax") as "none" | "lax",
  maxAge: 15 * 60 * 1000, // 15 minutes
};

const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: (isProd ? "none" : "lax") as "none" | "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/", // available across all endpoints
};

const clearCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: (isProd ? "none" : "lax") as "none" | "lax",
  path: "/",
};

// ─── Controller Actions ───────────────────────────────────────────────────────

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.registerUser(req.body);

  // Set dual cookies
  res.cookie("accessToken", result.accessToken, accessTokenCookieOptions);
  res.cookie("refreshToken", result.refreshToken, refreshTokenCookieOptions);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Registration successful. Welcome to DevShare!",
    data: result.user,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.loginUser(req.body);

  res.cookie("accessToken", result.accessToken, accessTokenCookieOptions);
  res.cookie("refreshToken", result.refreshToken, refreshTokenCookieOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Welcome back! Login successful.",
    data: result.user,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  const result = await UserService.refreshAccessToken(incomingRefreshToken);

  // Rotate cookies
  res.cookie("accessToken", result.accessToken, accessTokenCookieOptions);
  res.cookie("refreshToken", result.newRefreshToken, refreshTokenCookieOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token refreshed successfully",
    data: result.user,
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  const incomingRefreshToken = req.cookies?.refreshToken;
  const userId = req.user?.id;

  // Revoke session in database
  await UserService.logoutUser(userId, incomingRefreshToken);

  // Clear both cookies
  res.clearCookie("accessToken", clearCookieOptions);
  res.clearCookie("refreshToken", clearCookieOptions);
  // Also clear legacy 'token' cookie if any exists from previous version
  res.clearCookie("token", clearCookieOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged out successfully",
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
  const result = await UserService.updateProfile(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  await UserService.changePassword(userId, req.body);

  // Clear cookies so user logs in with new credentials
  res.clearCookie("accessToken", clearCookieOptions);
  res.clearCookie("refreshToken", clearCookieOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password changed successfully. Please log in with your new password.",
  });
});

export const UserController = {
  register,
  login,
  refreshToken,
  logout,
  getMe,
  updateProfile,
  changePassword,
};

export default UserController;

