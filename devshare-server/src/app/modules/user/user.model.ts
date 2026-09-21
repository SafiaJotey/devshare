import { Collection } from "mongodb";
import { getCollection } from "../../../config/db";
import { IUser } from "./user.interface";

export const USER_COLLECTION_NAME = "users";

export const getUserCollection = (): Collection<IUser> => {
  return getCollection<IUser>(USER_COLLECTION_NAME);
};

export const initUserIndexes = async (): Promise<void> => {
  try {
    const collection = getUserCollection();
    // Unique index on email to guarantee uniqueness at the database level
    await collection.createIndex({ email: 1 }, { unique: true });
  } catch (error) {
    console.error("Error creating user indexes:", error);
  }
};
