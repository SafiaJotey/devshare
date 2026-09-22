import { ObjectId, Filter } from "mongodb";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { getUserCollection } from "../user/user.model";
import { getBlogCollection } from "./blog.model";
import {
  IBlog,
  ICreateBlogPayload,
  IUpdateBlogPayload,
  IBlogFilterQuery,
  BlogCategory,
} from "./blog.interface";
import { IPaginationMeta } from "../../utils/response";

// Category default fallback hero images (high-resolution tech wallpapers)
const DEFAULT_CATEGORY_COVERS: Record<BlogCategory, string> = {
  Frontend:
    "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070",
  Backend:
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=2026",
  DevOps:
    "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=2070",
  "AI & Data":
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070",
  Security:
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070",
};

/**
 * Helper to generate a URL-safe slug from title + short random hash
 */
const generateSlug = (title: string): string => {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const randomHash = Math.random().toString(36).substring(2, 7);
  return `${base.slice(0, 60)}-${randomHash}`;
};

/**
 * Calculate estimated reading time based on total words across all blocks
 */
const calculateReadTime = (blocks: IBlog["blocks"]): string => {
  const allText = blocks
    .filter((b) => b.type !== "image")
    .map((b) => b.content)
    .join(" ");

  const words = allText.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} min read`;
};

/**
 * Determine the cover image for a blog
 */
const resolveCoverImage = (
  explicitCover: string | undefined,
  blocks: IBlog["blocks"],
  category: BlogCategory
): string => {
  if (explicitCover && explicitCover.trim().length > 0) {
    return explicitCover.trim();
  }

  // Look for first image block
  const firstImageBlock = blocks.find(
    (b) => b.type === "image" && b.content && b.content.trim().length > 0
  );
  if (firstImageBlock) {
    return firstImageBlock.content.trim();
  }

  return DEFAULT_CATEGORY_COVERS[category] || DEFAULT_CATEGORY_COVERS.Frontend;
};

// ─── Create Blog ─────────────────────────────────────────────────────────────

const createBlog = async (
  userId: string,
  payload: ICreateBlogPayload
): Promise<IBlog> => {
  const userCollection = getUserCollection();
  const blogCollection = getBlogCollection();

  if (!ObjectId.isValid(userId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user ID format");
  }

  const user = await userCollection.findOne({ _id: new ObjectId(userId) });
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Author account not found. Please log in again."
    );
  }

  const slug = generateSlug(payload.title);
  const readTime = calculateReadTime(payload.blocks);
  const coverImage = resolveCoverImage(
    payload.coverImage,
    payload.blocks,
    payload.category
  );

  const now = new Date();
  const newBlog: IBlog = {
    title: payload.title.trim(),
    slug,
    description: payload.description.trim(),
    category: payload.category,
    tags: payload.tags || [payload.category],
    coverImage,
    blocks: payload.blocks,
    author: {
      id: user._id!.toString(),
      name: user.name,
      avatar:
        user.avatar ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
          user.name
        )}`,
      title: user.title || "Developer & Contributor",
    },
    authorId: user._id!,
    status: payload.status || "Published",
    readTime,
    views: 0,
    likes: 0,
    createdAt: now,
    updatedAt: now,
  };

  const insertResult = await blogCollection.insertOne(newBlog as any);
  newBlog._id = insertResult.insertedId;

  return newBlog;
};

// ─── Get All Blogs (Public with Filters & Pagination) ─────────────────────────

const getAllBlogs = async (
  query: IBlogFilterQuery
): Promise<{ blogs: IBlog[]; meta: IPaginationMeta }> => {
  const blogCollection = getBlogCollection();

  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Math.min(50, Number(query.limit) || 10));
  const skip = (page - 1) * limit;

  const filter: Filter<IBlog> = {};

  // By default only published blogs are shown publicly
  if (query.status) {
    filter.status = query.status as any;
  } else {
    filter.status = "Published";
  }

  if (query.category && query.category !== "All") {
    filter.category = query.category as any;
  }

  if (query.search && query.search.trim().length > 0) {
    const searchRegex = new RegExp(query.search.trim(), "i");
    filter.$or = [{ title: searchRegex }, { description: searchRegex }];
  }

  const sortField = query.sortBy || "createdAt";
  const sortDirection = query.sortOrder === "asc" ? 1 : -1;

  const [blogs, total] = await Promise.all([
    blogCollection
      .find(filter)
      .sort({ [sortField]: sortDirection })
      .skip(skip)
      .limit(limit)
      .toArray(),
    blogCollection.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    blogs,
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};

// ─── Get Single Blog by ID or Slug ───────────────────────────────────────────

const getBlogByIdOrSlug = async (idOrSlug: string): Promise<IBlog> => {
  const blogCollection = getBlogCollection();

  let filter: Filter<IBlog>;

  if (ObjectId.isValid(idOrSlug)) {
    filter = { _id: new ObjectId(idOrSlug) };
  } else {
    filter = { slug: idOrSlug };
  }

  // Atomically increment views on read
  const blog = await blogCollection.findOneAndUpdate(
    filter,
    { $inc: { views: 1 } },
    { returnDocument: "after" }
  );

  if (!blog) {
    throw new AppError(httpStatus.NOT_FOUND, "Article not found");
  }

  return blog as IBlog;
};

// ─── Get Current User's Blogs (Dashboard) ────────────────────────────────────

const getMyBlogs = async (
  userId: string,
  query: IBlogFilterQuery
): Promise<{ blogs: IBlog[]; meta: IPaginationMeta }> => {
  const blogCollection = getBlogCollection();

  if (!ObjectId.isValid(userId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user ID format");
  }

  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Math.min(100, Number(query.limit) || 20));
  const skip = (page - 1) * limit;

  const filter: Filter<IBlog> = {
    authorId: new ObjectId(userId),
  };

  if (query.status && query.status !== "All") {
    filter.status = query.status as any;
  }

  if (query.category && query.category !== "All") {
    filter.category = query.category as any;
  }

  if (query.search && query.search.trim().length > 0) {
    const searchRegex = new RegExp(query.search.trim(), "i");
    filter.$or = [{ title: searchRegex }, { description: searchRegex }];
  }

  const [blogs, total] = await Promise.all([
    blogCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    blogCollection.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    blogs,
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};

// ─── Delete Blog ─────────────────────────────────────────────────────────────

const deleteBlog = async (
  userId: string,
  blogId: string,
  role?: string
): Promise<void> => {
  const blogCollection = getBlogCollection();

  if (!ObjectId.isValid(blogId) || !ObjectId.isValid(userId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid ID format");
  }

  const blog = await blogCollection.findOne({ _id: new ObjectId(blogId) });
  if (!blog) {
    throw new AppError(httpStatus.NOT_FOUND, "Article not found");
  }

  // Only author or admin can delete
  const isAuthor = blog.authorId.toString() === userId;
  const isAdmin = role === "admin";

  if (!isAuthor && !isAdmin) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You do not have permission to delete this article"
    );
  }

  await blogCollection.deleteOne({ _id: new ObjectId(blogId) });
};

export const BlogService = {
  createBlog,
  getAllBlogs,
  getBlogByIdOrSlug,
  getMyBlogs,
  deleteBlog,
};

export default BlogService;
