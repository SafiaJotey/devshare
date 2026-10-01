import { ObjectId } from "mongodb";

export type NotificationType = "like" | "comment" | "follow" | "save" | "system";

export interface INotification {
  _id?: ObjectId;
  userId: string; // Target recipient user ID
  senderId?: string; // Triggering user ID
  senderName?: string;
  senderAvatar?: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: Date;
}

export interface ICreateNotificationPayload {
  userId: string;
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}
