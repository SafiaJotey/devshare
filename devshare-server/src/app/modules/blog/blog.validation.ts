import { z } from "zod";

const blockTypeEnum = z.enum([
  "h2", "h3", "h4", "h5", "h6",
  "p", "ul", "ol",
  "code", "quote", "image", "layout"
]);
const blogCategoryEnum = z.enum([
  "Frontend",
  "Backend",
  "DevOps",
  "AI/ML",
  "Security",
]);
const blogStatusEnum = z.enum(["Draft", "Published", "Archived"]);

const blockSchema = z.object({
  id: z.string({ message: "Block ID is required" }),
  type: blockTypeEnum,
  content: z.string().default(""),
  metadata: z.string().optional(),
});

const createBlogValidationSchema = z.object({
  title: z
    .string({ message: "Title is required" })
    .trim()
    .min(3, "Title must be at least 3 characters long")
    .max(200, "Title cannot exceed 200 characters"),
  description: z
    .string({ message: "Description is required" })
    .trim()
    .min(5, "Description must be at least 5 characters long")
    .max(500, "Description cannot exceed 500 characters"),
  category: blogCategoryEnum,
  blocks: z
    .array(blockSchema)
    .min(1, "At least one content block is required"),
  status: blogStatusEnum.optional().default("Published"),
  coverImage: z
    .string()
    .url("Cover image must be a valid URL")
    .optional()
    .or(z.literal("")),
  tags: z.array(z.string().trim()).optional(),
});

const updateBlogValidationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters long")
    .max(200, "Title cannot exceed 200 characters")
    .optional(),
  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters long")
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
  category: blogCategoryEnum.optional(),
  blocks: z.array(blockSchema).min(1).optional(),
  status: blogStatusEnum.optional(),
  coverImage: z
    .string()
    .url("Cover image must be a valid URL")
    .optional()
    .or(z.literal("")),
  tags: z.array(z.string().trim()).optional(),
});

const addCommentValidationSchema = z.object({
  content: z
    .string({ message: "Comment content is required" })
    .trim()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment cannot exceed 1000 characters"),
});

export const BlogValidation = {
  createBlogValidationSchema,
  updateBlogValidationSchema,
  addCommentValidationSchema,
};

export default BlogValidation;
