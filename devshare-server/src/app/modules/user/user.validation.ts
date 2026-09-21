import { z } from "zod";

const registerValidationSchema = z.object({
  name: z
    .string({
      error: "Name is required",
    })
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name cannot exceed 50 characters"),
  email: z
    .string({
      error: "Email is required",
    })
    .email("Please provide a valid email address"),
  password: z
    .string({
      error: "Password is required",
    })
    .min(6, "Password must be at least 6 characters long"),
  title: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().url("Avatar must be a valid URL").optional(),
});

const loginValidationSchema = z.object({
  email: z
    .string({
      error: "Email is required",
    })
    .email("Please provide a valid email address"),
  password: z
    .string({
      error: "Password is required",
    })
    .min(1, "Password is required"),
});

const updateProfileValidationSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  title: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().url("Avatar must be a valid URL").optional(),
  socialLinks: z
    .object({
      github: z.string().optional(),
      twitter: z.string().optional(),
      website: z.string().optional(),
    })
    .optional(),
});

export const UserValidation = {
  registerValidationSchema,
  loginValidationSchema,
  updateProfileValidationSchema,
};

export default UserValidation;
