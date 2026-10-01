import { Collection } from "mongodb";
import { getCollection } from "../../../config/db";
import { INotification } from "./notification.interface";

export const NOTIFICATION_COLLECTION_NAME = "notifications";

export const getNotificationCollection = (): Collection<INotification> => {
  return getCollection<INotification>(NOTIFICATION_COLLECTION_NAME);
};

export const initializeNotificationIndexes = async (): Promise<void> => {
  try {
    const collection = getNotificationCollection();
    await collection.createIndex({ userId: 1, createdAt: -1 });
    await collection.createIndex({ userId: 1, read: 1 });
  } catch (error) {
    console.error("Failed to initialize notification collection indexes:", error);
  }
};
