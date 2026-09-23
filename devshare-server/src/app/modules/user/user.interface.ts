import { ObjectId } from "mongodb";

export interface IUser {
  _id?: ObjectId;
  name: string;
  email: string;
  password?: string;
  role: "user" | "admin";
  avatar?: string;
  title?: string;
  bio?: string;
  socialLinks?: {
    github?: string;
    twitter?: string;
    website?: string;
  };
  provider?: string;
  /** SHA-256 hashed refresh tokens — one entry per active device/session */
  refreshTokens: string[];
  /** Allows admins to suspend accounts without deletion */
  isActive: boolean;
  /** Timestamp of the most recent successful login */
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/** Safe user shape returned to clients — password and tokens never exposed */
export type IUserResponse = Omit<IUser, "password" | "refreshTokens">;

export interface IJwtPayload {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
}

export interface IRegisterUserPayload {
  name: string;
  email: string;
  password: string;
  title?: string;
  bio?: string;
  avatar?: string;
}

export interface ILoginUserPayload {
  email: string;
  password: string;
}

export interface ISocialLoginPayload {
  email: string;
  name: string;
  avatar?: string;
  provider: "google" | "facebook" | "linkedin" | string;
  idToken?: string;
}

export interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
