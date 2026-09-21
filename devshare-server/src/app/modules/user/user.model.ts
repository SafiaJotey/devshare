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

    // Unique index on email — database-level guarantee of uniqueness
    await collection.createIndex({ email: 1 }, { unique: true });

    // Index on refreshTokens array for fast token lookup during rotation/revocation
    await collection.createIndex({ refreshTokens: 1 });

    // Index for sorting/filtering by last login
    await collection.createIndex({ lastLoginAt: -1 });

    console.log("✅ User collection indexes initialized");
  } catch (error) {
    console.error("Error creating user indexes:", error);
  }
};
