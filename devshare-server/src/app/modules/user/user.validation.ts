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
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(50).optional(),
  title: z.string().trim().max(100).optional(),
  bio: z.string().trim().max(500).optional(),
  primaryDomain: z.string().trim().max(50).optional(),
  skills: z.array(z.string().trim().max(30)).max(20).optional(),
  avatar: z
    .string()
    .trim()
    .refine(
      (val) =>
        !val ||
        val.startsWith("http://") ||
        val.startsWith("https://") ||
        val.startsWith("data:image/"),
      { message: "Avatar must be a valid image URL or base64 string" }
    )
    .optional(),
  socialLinks: z
    .object({
      github: z.string().trim().optional(),
      twitter: z.string().trim().optional(),
      linkedin: z.string().trim().optional(),
      website: z.string().trim().optional(),
    })
    .optional(),
  preferences: z
    .object({
      defaultCategory: z.string().trim().optional(),
      codeFont: z.string().trim().optional(),
      autoSave: z.boolean().optional(),
      emailOnComment: z.boolean().optional(),
      emailOnLike: z.boolean().optional(),
      weeklyDigest: z.boolean().optional(),
      showInLeaderboard: z.boolean().optional(),
      publicEmail: z.boolean().optional(),
    })
    .optional(),
});

const avatarUploadValidationSchema = z.object({
  avatar: z
    .string({ error: "Profile image is required" })
    .max(3_500_000, "Profile image must be 3 MB or smaller")
    .refine(
      (val) => val.startsWith("data:image/") || val.startsWith("http://") || val.startsWith("https://"),
      { message: "Upload a valid image" }
    ),
});

// ─── Change Password ──────────────────────────────────────────────────────────

const changePasswordValidationSchema = z.object({
  currentPassword: z
    .string({ error: "Current password is required" })
    .min(1, "Current password is required"),
  newPassword: passwordValidator,
});

const deleteAccountValidationSchema = z.object({
  password: z.string().optional(),
});

// ─── Exports ──────────────────────────────────────────────────────────────────

export const UserValidation = {
  registerValidationSchema,
  loginValidationSchema,
  socialLoginValidationSchema,
  updateProfileValidationSchema,
  avatarUploadValidationSchema,
  changePasswordValidationSchema,
  deleteAccountValidationSchema,
};

export default UserValidation;
