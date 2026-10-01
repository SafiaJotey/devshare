import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/response";
import { sendResponse } from "../../utils/response";
import { NotificationService } from "./notification.service";
import { IJwtPayload } from "../user/user.interface";

const getMyNotifications = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IJwtPayload;
  const result = await NotificationService.getMyNotifications(user.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notifications retrieved successfully",
    data: result,
  });
});

const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IJwtPayload;
  const { id } = req.params;
  await NotificationService.markAsRead(user.id, id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notification marked as read",
    data: null,
  });
});

const markAllAsRead = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IJwtPayload;
  await NotificationService.markAllAsRead(user.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All notifications marked as read",
    data: null,
  });
});

const deleteNotification = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IJwtPayload;
  const { id } = req.params;
  await NotificationService.deleteNotification(user.id, id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notification deleted",
    data: null,
  });
});

export const NotificationController = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
