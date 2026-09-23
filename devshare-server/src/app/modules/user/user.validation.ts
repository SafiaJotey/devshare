import { z } from "zod";

// ─── Shared Validators ────────────────────────────────────────────────────────

/**
 * Industry-standard password: min 8 chars, at least one uppercase letter,
 * one lowercase letter, and one digit.
 */
const passwordValidator = z
  .string({ error: "Password is required" })
  .min(8, "Password must be at least 8 characters long")
  .max(128, "Password cannot exceed 128 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

// ─── Register ─────────────────────────────────────────────────────────────────

const registerValidationSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name cannot exceed 50 characters"),
  email: z
    .string({ error: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address"),
  password: passwordValidator,
  title: z.string().trim().max(100).optional(),
  bio: z.string().trim().max(500).optional(),
  avatar: z.string().url("Avatar must be a valid URL").optional(),
});

// ─── Login ────────────────────────────────────────────────────────────────────

const loginValidationSchema = z.object({
  email: z
    .string({ error: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address"),
  password: z
    .string({ error: "Password is required" })
    .min(1, "Password is required"),
});

// ─── Social Login (Firebase) ──────────────────────────────────────────────────

const socialLoginValidationSchema = z.object({
  email: z
    .string({ error: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address"),
  name: z.string().trim().min(1, "Name is required").max(100),
  avatar: z.string().url("Avatar must be a valid URL").optional(),
  provider: z.string().trim().min(1, "Provider is required"),
  idToken: z.string().optional(),
});

// ─── Update Profile ───────────────────────────────────────────────────────────

const updateProfileValidationSchema = z.object({
  name: z.string().trim().min(2).max(50).optional(),
  title: z.string().trim().max(100).optional(),
  bio: z.string().trim().max(500).optional(),
  avatar: z.string().url("Avatar must be a valid URL").optional(),
  socialLinks: z
    .object({
      github: z
        .string()
        .url("GitHub link must be a valid URL")
        .optional()
        .or(z.literal("")),
      twitter: z
        .string()
        .url("Twitter link must be a valid URL")
        .optional()
        .or(z.literal("")),
      website: z
        .string()
        .url("Website link must be a valid URL")
        .optional()
        .or(z.literal("")),
    })
    .optional(),
});

// ─── Change Password ──────────────────────────────────────────────────────────

const changePasswordValidationSchema = z.object({
  currentPassword: z
    .string({ error: "Current password is required" })
    .min(1, "Current password is required"),
  newPassword: passwordValidator,
});

// ─── Exports ──────────────────────────────────────────────────────────────────

export const UserValidation = {
  registerValidationSchema,
  loginValidationSchema,
  socialLoginValidationSchema,
  updateProfileValidationSchema,
  changePasswordValidationSchema,
};

export default UserValidation;
