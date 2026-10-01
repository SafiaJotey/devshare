import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync, sendResponse } from "../../utils/response";
import BlogService from "./blog.service";

const createBlog = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await BlogService.createBlog(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Article published successfully!",
    data: result,
  });
});

const getAllBlogs = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogService.getAllBlogs(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Articles retrieved successfully",
    data: result.blogs,
    meta: result.meta,
  });
});

const getBlogById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Track viewed articles in cookie to prevent duplicate view increments
  const viewedCookie = req.cookies?.devshare_viewed_articles;
  let viewedList: string[] = [];
  if (viewedCookie) {
    try {
      viewedList = typeof viewedCookie === "string" ? JSON.parse(viewedCookie) : viewedCookie;
      if (!Array.isArray(viewedList)) viewedList = [];
    } catch {
      viewedList = typeof viewedCookie === "string" ? viewedCookie.split(",") : [];
    }
  }

  const alreadyViewed = viewedList.includes(id);
  const result = await BlogService.getBlogByIdOrSlug(id as string, !alreadyViewed);

  // If not previously viewed and blog found, update cookie with blog id and slug (24h window)
  if (!alreadyViewed && result) {
    const idsToAdd = [id];
    if (result._id) idsToAdd.push(result._id.toString());
    if (result.slug) idsToAdd.push(result.slug);

    const updatedViewed = Array.from(new Set([...viewedList, ...idsToAdd])).slice(-100);
    res.cookie("devshare_viewed_articles", JSON.stringify(updatedViewed), {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "lax",
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Article retrieved successfully",
    data: result,
  });
});

const getMyBlogs = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await BlogService.getMyBlogs(userId, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your articles retrieved successfully",
    data: result.blogs,
    meta: result.meta,
  });
});

const getMyBlogById = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogService.getMyBlogById(
    req.user!.id,
    req.params.id as string,
    req.user!.role
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Article retrieved successfully",
    data: result,
  });
});

const updateBlog = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const role = req.user!.role;
  const { id } = req.params;
  const result = await BlogService.updateBlog(userId, id as string, req.body, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Article updated successfully",
    data: result,
  });
});

const deleteBlog = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const role = req.user!.role;
  const { id } = req.params;

  await BlogService.deleteBlog(userId, id as string, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Article deleted successfully",
    data: null,
  });
});

const toggleLike = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;
  const result = await BlogService.toggleLike(userId, id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.liked ? "Article liked!" : "Like removed",
    data: result,
  });
});

const toggleSave = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;
  const result = await BlogService.toggleSave(userId, id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.saved ? "Article saved for later!" : "Removed from saved",
    data: result,
  });
});

const addComment = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;
  const { content } = req.body;

  if (!content || content.trim().length === 0) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Comment content is required",
    });
  }

  const result = await BlogService.addComment(userId, id as string, content);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Comment added successfully",
    data: result.comments,
  });
});

const deleteComment = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const role = req.user!.role;
  const { id, commentId } = req.params;

  await BlogService.deleteComment(userId, id as string, commentId as string, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment deleted successfully",
    data: null,
  });
});

const getRelatedBlogs = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { category, limit } = req.query;

  const result = await BlogService.getRelatedBlogs(
    id as string,
    category as string,
    limit ? Number(limit) : 3
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Related articles retrieved",
    data: result,
  });
});

const getBlogInteractionState = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;
  const result = await BlogService.getBlogInteractionState(userId, id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Interaction state retrieved",
    data: result,
  });
});

const getCategoryStats = catchAsync(async (_req: Request, res: Response) => {
  const result = await BlogService.getCategoryStats();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category counts retrieved successfully",
    data: result,
  });
});

export const BlogController = {
  createBlog,
  getAllBlogs,
  getBlogById,
  getMyBlogs,
  getMyBlogById,
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

export default BlogController;
