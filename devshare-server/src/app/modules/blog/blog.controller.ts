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
  const result = await BlogService.getBlogByIdOrSlug(id as string);

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

export const BlogController = {
  createBlog,
  getAllBlogs,
  getBlogById,
  getMyBlogs,
  deleteBlog,
};

export default BlogController;
