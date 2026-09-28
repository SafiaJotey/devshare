import { Router } from "express";
import BlogController from "./blog.controller";
import BlogValidation from "./blog.validation";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";

const router: Router = Router();

// Create new blog (Protected)
router.post(
  "/",
  auth(),
  validateRequest(BlogValidation.createBlogValidationSchema),
  BlogController.createBlog
);

// Get all blogs (Public with category/search/pagination filters)
router.get("/", BlogController.getAllBlogs);

// Get current user's blogs (Protected - Dashboard)
router.get("/my/blogs", auth(), BlogController.getMyBlogs);

// Get one of the current user's articles for editing (does not increment views)
router.get("/my/blogs/:id", auth(), BlogController.getMyBlogById);

// Get related blogs by category (Public)
router.get("/:id/related", BlogController.getRelatedBlogs);

// Get single blog by ID or slug (Public)
router.get("/:id", BlogController.getBlogById);

// Get interaction state for logged-in user (liked, saved, likes count)
router.get("/:id/interactions", auth(), BlogController.getBlogInteractionState);

// Toggle like (Protected)
router.post("/:id/like", auth(), BlogController.toggleLike);

// Toggle save (Protected)
router.post("/:id/save", auth(), BlogController.toggleSave);

// Add comment (Protected)
router.post(
  "/:id/comments",
  auth(),
  validateRequest(BlogValidation.addCommentValidationSchema),
  BlogController.addComment
);

// Delete comment (Protected - Author or Admin)
router.delete("/:id/comments/:commentId", auth(), BlogController.deleteComment);

// Update a blog (Protected - Author or Admin)
router.patch(
  "/:id",
  auth(),
  validateRequest(BlogValidation.updateBlogValidationSchema),
  BlogController.updateBlog
);

// Delete blog (Protected - Author or Admin)
router.delete("/:id", auth(), BlogController.deleteBlog);

export const BlogRoutes: Router = router;
export default BlogRoutes;
