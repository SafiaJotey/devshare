import { Collection } from "mongodb";
import { getCollection } from "../../../config/db";
import { IBlog } from "./blog.interface";

export const BLOG_COLLECTION_NAME = "blogs";

export const getBlogCollection = (): Collection<IBlog> => {
  return getCollection<IBlog>(BLOG_COLLECTION_NAME);
};

export const initBlogIndexes = async (): Promise<void> => {
  try {
    const collection = getBlogCollection();

    // Unique index on slug for URL lookups
    await collection.createIndex({ slug: 1 }, { unique: true });

    // Compound index for category listings filtered by status, sorted by newest
    await collection.createIndex({ category: 1, status: 1, createdAt: -1 });

    // Index for user-specific blog queries (dashboard my-blogs)
    await collection.createIndex({ authorId: 1, createdAt: -1 });

    // Text search index on title and description
    await collection.createIndex(
      { title: "text", description: "text" },
      { name: "blog_text_search_index" }
    );

    console.log("✅ Blog collection indexes initialized");
  } catch (error) {
    console.error("Error creating blog indexes:", error);
  }
};
