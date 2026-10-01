import { ObjectId } from "mongodb";
import { getNotificationCollection } from "./notification.model";
import { ICreateNotificationPayload, INotification } from "./notification.interface";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";

const createNotification = async (
  payload: ICreateNotificationPayload
): Promise<INotification> => {
  const collection = getNotificationCollection();

  // Don't send notification to self
  if (payload.senderId && payload.senderId === payload.userId) {
    return null as any;
  }

  const notification: INotification = {
    userId: payload.userId,
    senderId: payload.senderId,
    senderName: payload.senderName,
    senderAvatar: payload.senderAvatar,
    type: payload.type,
    title: payload.title,
    message: payload.message,
    link: payload.link,
    read: false,
    createdAt: new Date(),
  };

  const result = await collection.insertOne(notification);
  return { ...notification, _id: result.insertedId };
};

const getMyNotifications = async (userId: string) => {
  const collection = getNotificationCollection();

  const notifications = await collection
    .find({ userId })
    .sort({ createdAt: -1 })
    .limit(30)
    .toArray();

  const unreadCount = await collection.countDocuments({
    userId,
    read: false,
  });

  // If new user with 0 notifications, seed a welcome notification
  if (notifications.length === 0) {
    const welcomeNotification: INotification = {
      userId,
      type: "system",
      title: "Welcome to DevShare!",
      message: "Start discovering technical blogs, bookmark articles for later, and follow top contributors.",
      link: "/blogs",
      read: false,
      createdAt: new Date(),
    };
    const res = await collection.insertOne(welcomeNotification);
    return {
      notifications: [{ ...welcomeNotification, _id: res.insertedId }],
      unreadCount: 1,
    };
  }

  return {
    notifications,
    unreadCount,
  };
};

const markAsRead = async (userId: string, notificationId: string): Promise<void> => {
  if (!ObjectId.isValid(notificationId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid notification ID");
  }

  const collection = getNotificationCollection();
  await collection.updateOne(
    { _id: new ObjectId(notificationId), userId },
    { $set: { read: true } }
  );
};

const markAllAsRead = async (userId: string): Promise<void> => {
  const collection = getNotificationCollection();
  await collection.updateMany(
    { userId, read: false },
    { $set: { read: true } }
  );
};

const deleteNotification = async (userId: string, notificationId: string): Promise<void> => {
  if (!ObjectId.isValid(notificationId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid notification ID");
  }

  const collection = getNotificationCollection();
  await collection.deleteOne({ _id: new ObjectId(notificationId), userId });
};

export const NotificationService = {
  createNotification,
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
