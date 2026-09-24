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

// Get single blog by ID or slug (Public)
router.get("/:id", BlogController.getBlogById);

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
