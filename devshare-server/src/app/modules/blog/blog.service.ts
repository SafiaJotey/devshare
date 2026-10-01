import { ObjectId, Filter } from "mongodb";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { getUserCollection } from "../user/user.model";
import { getBlogCollection } from "./blog.model";
import {
  IBlog,
  IBlogComment,
  ICreateBlogPayload,
  IUpdateBlogPayload,
  IBlogFilterQuery,
  BlogCategory,
} from "./blog.interface";
import { IPaginationMeta } from "../../utils/response";
import { NotificationService } from "../notification/notification.service";

// Category default fallback hero images (high-resolution tech wallpapers)
const DEFAULT_CATEGORY_COVERS: Record<BlogCategory, string> = {
  Frontend:
    "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070",
  Backend:
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=2026",
  DevOps:
    "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=2070",
  "AI/ML":
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

  let sortCriteria: any = { createdAt: -1 };
  if (query.sortBy === "featured" || query.sortBy === "popular") {
    // Most read (views desc), most liked (likes desc), tiebreaker newest (createdAt desc)
    sortCriteria = { views: -1, likes: -1, createdAt: -1 };
  } else if (query.sortBy === "views") {
    sortCriteria = { views: query.sortOrder === "asc" ? 1 : -1, likes: -1, createdAt: -1 };
  } else if (query.sortBy === "likes") {
    sortCriteria = { likes: query.sortOrder === "asc" ? 1 : -1, views: -1, createdAt: -1 };
  } else if (query.sortBy) {
    const sortField = query.sortBy;
    const sortDirection = query.sortOrder === "asc" ? 1 : -1;
    sortCriteria = { [sortField]: sortDirection, createdAt: -1 };
  }

  const [blogs, total] = await Promise.all([
    blogCollection
      .find(filter)
      .sort(sortCriteria)
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

const getBlogByIdOrSlug = async (
  idOrSlug: string,
  incrementView: boolean = true
): Promise<IBlog> => {
  const blogCollection = getBlogCollection();

  let filter: Filter<IBlog>;

  if (ObjectId.isValid(idOrSlug)) {
    filter = { _id: new ObjectId(idOrSlug), status: "Published" };
  } else {
    filter = { slug: idOrSlug, status: "Published" };
  }

  let blog: IBlog | null = null;
  if (incrementView) {
    // Atomically increment views on read
    blog = (await blogCollection.findOneAndUpdate(
      filter,
      { $inc: { views: 1 } },
      { returnDocument: "after" }
    )) as IBlog | null;
  } else {
    blog = (await blogCollection.findOne(filter)) as IBlog | null;
  }

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

/** Fetches an editable article without exposing drafts or inflating view counts. */
const getMyBlogById = async (
  userId: string,
  blogId: string,
  role?: string
): Promise<IBlog> => {
  const blogCollection = getBlogCollection();

  if (!ObjectId.isValid(userId) || !ObjectId.isValid(blogId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid ID format");
  }

  const filter: Filter<IBlog> = { _id: new ObjectId(blogId) };
  if (role !== "admin") {
    filter.authorId = new ObjectId(userId);
  }

  const blog = await blogCollection.findOne(filter);
  if (!blog) {
    throw new AppError(httpStatus.NOT_FOUND, "Article not found");
  }

  return blog;
};

// ─── Delete Blog ─────────────────────────────────────────────────────────────

const updateBlog = async (
  userId: string,
  blogId: string,
  payload: IUpdateBlogPayload,
  role?: string
): Promise<IBlog> => {
  const blogCollection = getBlogCollection();

  if (!ObjectId.isValid(blogId) || !ObjectId.isValid(userId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid ID format");
  }

  const blog = await blogCollection.findOne({ _id: new ObjectId(blogId) });
  if (!blog) {
    throw new AppError(httpStatus.NOT_FOUND, "Article not found");
  }

  const isAuthor = blog.authorId.toString() === userId;
  if (!isAuthor && role !== "admin") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You do not have permission to update this article"
    );
  }

  const nextBlocks = payload.blocks || blog.blocks;
  const nextCategory = payload.category || blog.category;
  const updatePayload: IUpdateBlogPayload & { updatedAt: Date; readTime?: string; coverImage?: string } = {
    ...payload,
    updatedAt: new Date(),
  };
  if (payload.title !== undefined) updatePayload.title = payload.title.trim();
  if (payload.description !== undefined) updatePayload.description = payload.description.trim();

  // Keep derived fields accurate after an author edits article content or its cover.
  if (payload.blocks) {
    updatePayload.readTime = calculateReadTime(nextBlocks);
  }
  if (payload.coverImage !== undefined || payload.blocks || payload.category) {
    updatePayload.coverImage = resolveCoverImage(payload.coverImage, nextBlocks, nextCategory);
  }

  const updated = await blogCollection.findOneAndUpdate(
    { _id: new ObjectId(blogId) },
    { $set: updatePayload },
    { returnDocument: "after" }
  );

  return updated as IBlog;
};

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

// ─── Toggle Like ─────────────────────────────────────────────────────────────

const toggleLike = async (
  userId: string,
  blogId: string
): Promise<{ liked: boolean; likes: number }> => {
  const blogCollection = getBlogCollection();

  if (!ObjectId.isValid(blogId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid blog ID");
  }

  const blog = await blogCollection.findOne({ _id: new ObjectId(blogId) });
  if (!blog) {
    throw new AppError(httpStatus.NOT_FOUND, "Article not found");
  }

  const alreadyLiked = (blog.likesBy || []).includes(userId);

  if (alreadyLiked) {
    const updated = await blogCollection.findOneAndUpdate(
      { _id: new ObjectId(blogId) },
      { $pull: { likesBy: userId }, $inc: { likes: -1 } },
      { returnDocument: "after" }
    );
    return { liked: false, likes: updated?.likes ?? 0 };
  } else {
    const updated = await blogCollection.findOneAndUpdate(
      { _id: new ObjectId(blogId) },
      { $addToSet: { likesBy: userId }, $inc: { likes: 1 } },
      { returnDocument: "after" }
    );

    // Trigger notification to article author
    if (blog.authorId && blog.authorId.toString() !== userId) {
      try {
        const liker = await getUserCollection().findOne({ _id: new ObjectId(userId) });
        await NotificationService.createNotification({
          userId: blog.authorId.toString(),
          senderId: userId,
          senderName: liker?.name || "A developer",
          senderAvatar: liker?.avatar,
          type: "like",
          title: "New Appreciation",
          message: `${liker?.name || "A developer"} liked your article "${blog.title}"`,
          link: `/blogs/${blog._id}`,
        });
      } catch (err) {
        console.error("Failed to dispatch like notification:", err);
      }
    }

    return { liked: true, likes: updated?.likes ?? 0 };
  }
};

// ─── Toggle Save ─────────────────────────────────────────────────────────────

const toggleSave = async (
  userId: string,
  blogId: string
): Promise<{ saved: boolean }> => {
  const blogCollection = getBlogCollection();

  if (!ObjectId.isValid(blogId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid blog ID");
  }

  const blog = await blogCollection.findOne({ _id: new ObjectId(blogId) });
  if (!blog) {
    throw new AppError(httpStatus.NOT_FOUND, "Article not found");
  }

  const alreadySaved = (blog.savedBy || []).includes(userId);

  if (alreadySaved) {
    await blogCollection.updateOne(
      { _id: new ObjectId(blogId) },
      { $pull: { savedBy: userId } }
    );
    return { saved: false };
  } else {
    await blogCollection.updateOne(
      { _id: new ObjectId(blogId) },
      { $addToSet: { savedBy: userId } }
    );

    // Trigger notification to article author
    if (blog.authorId && blog.authorId.toString() !== userId) {
      try {
        const saver = await getUserCollection().findOne({ _id: new ObjectId(userId) });
        await NotificationService.createNotification({
          userId: blog.authorId.toString(),
          senderId: userId,
          senderName: saver?.name || "A developer",
          senderAvatar: saver?.avatar,
          type: "save",
          title: "Article Saved",
          message: `${saver?.name || "A developer"} bookmarked your article "${blog.title}"`,
          link: `/blogs/${blog._id}`,
        });
      } catch (err) {
        console.error("Failed to dispatch save notification:", err);
      }
    }

    return { saved: true };
  }
};

// ─── Add Comment ─────────────────────────────────────────────────────────────

const addComment = async (
  userId: string,
  blogId: string,
  content: string
): Promise<IBlog> => {
  const blogCollection = getBlogCollection();
  const userCollection = getUserCollection();

  if (!ObjectId.isValid(blogId) || !ObjectId.isValid(userId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid ID format");
  }

  const user = await userCollection.findOne({ _id: new ObjectId(userId) });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const comment: IBlogComment = {
    id: new ObjectId().toString(),
    userId,
    userName: user.name,
    userAvatar:
      user.avatar ||
      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`,
    content: content.trim(),
    createdAt: new Date(),
  };

  const updated = await blogCollection.findOneAndUpdate(
    { _id: new ObjectId(blogId) },
    { $push: { comments: comment } },
    { returnDocument: "after" }
  );

  if (!updated) {
    throw new AppError(httpStatus.NOT_FOUND, "Article not found");
  }

  // Trigger notification to article author
  if (updated.authorId && updated.authorId.toString() !== userId) {
    try {
      await NotificationService.createNotification({
        userId: updated.authorId.toString(),
        senderId: userId,
        senderName: user.name,
        senderAvatar: user.avatar,
        type: "comment",
        title: "New Discussion Comment",
        message: `${user.name} commented on "${updated.title}"`,
        link: `/blogs/${updated._id}#discussion`,
      });
    } catch (err) {
      console.error("Failed to dispatch comment notification:", err);
    }
  }

  return updated as IBlog;
};

// ─── Delete Comment ───────────────────────────────────────────────────────────

const deleteComment = async (
  userId: string,
  blogId: string,
  commentId: string,
  role?: string
): Promise<void> => {
  const blogCollection = getBlogCollection();

  if (!ObjectId.isValid(blogId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid blog ID");
  }

  const blog = await blogCollection.findOne({ _id: new ObjectId(blogId) });
  if (!blog) {
    throw new AppError(httpStatus.NOT_FOUND, "Article not found");
  }

  const comment = (blog.comments || []).find((c) => c.id === commentId);
  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, "Comment not found");
  }

  if (comment.userId !== userId && role !== "admin") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You do not have permission to delete this comment"
    );
  }

  await blogCollection.updateOne(
    { _id: new ObjectId(blogId) },
    { $pull: { comments: { id: commentId } } }
  );
};

// ─── Get Related Blogs ─────────────────────────────────────────────────────────

const getRelatedBlogs = async (
  blogId: string,
  category: string,
  limit = 3
): Promise<IBlog[]> => {
  const blogCollection = getBlogCollection();

  const filter: Filter<IBlog> = {
    status: "Published",
    category: category as BlogCategory,
  };

  if (ObjectId.isValid(blogId)) {
    filter._id = { $ne: new ObjectId(blogId) } as any;
  }

  const blogs = await blogCollection
    .find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();

  return blogs;
};

// ─── Get Blog Interaction State ────────────────────────────────────────────────

const getBlogInteractionState = async (
  userId: string,
  blogId: string
): Promise<{ liked: boolean; saved: boolean; likes: number }> => {
  const blogCollection = getBlogCollection();

  if (!ObjectId.isValid(blogId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid blog ID");
  }

  const blog = await blogCollection.findOne({ _id: new ObjectId(blogId) });
  if (!blog) {
    throw new AppError(httpStatus.NOT_FOUND, "Article not found");
  }

  return {
    liked: (blog.likesBy || []).includes(userId),
    saved: (blog.savedBy || []).includes(userId),
    likes: blog.likes,
  };
};

const getCategoryStats = async (): Promise<Record<string, number>> => {
  const collection = getBlogCollection();
  const counts = await collection
    .aggregate<{ _id: string; count: number }>([
      { $match: { status: "Published" } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ])
    .toArray();

  const countMap: Record<string, number> = {
    Frontend: 0,
    Backend: 0,
    DevOps: 0,
    "AI/ML": 0,
    Security: 0,
  };

  for (const item of counts) {
    if (item._id) {
      countMap[item._id] = item.count;
    }
  }

  return countMap;
};

const getMySavedBlogs = async (
  userId: string,
  query: Record<string, unknown> = {}
) => {
  const blogCollection = getBlogCollection();

  const filter: any = {
    savedBy: userId,
  };

  const { search, category, page = 1, limit = 12 } = query as any;

  if (category && category !== "All") {
    filter.category = category;
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const currentPage = Math.max(1, Number(page));
  const pageLimit = Math.max(1, Math.min(50, Number(limit)));
  const skip = (currentPage - 1) * pageLimit;

  const total = await blogCollection.countDocuments(filter);
  const blogs = await blogCollection
    .find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageLimit)
    .toArray();

  return {
    meta: {
      page: currentPage,
      limit: pageLimit,
      total,
      totalPages: Math.ceil(total / pageLimit),
    },
    blogs,
  };
};

export const BlogService = {
  createBlog,
  getAllBlogs,
  getBlogByIdOrSlug,
  getMyBlogs,
  getMyBlogById,
  getMySavedBlogs,
  updateBlog,
  deleteBlog,
  toggleLike,
  toggleSave,
  addComment,
  deleteComment,
  getRelatedBlogs,
  getBlogInteractionState,
  getCategoryStats,
};

export default BlogService;
