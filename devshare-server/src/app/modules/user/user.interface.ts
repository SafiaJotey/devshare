import { ObjectId } from "mongodb";

export interface IUser {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  avatar?: string;
  title?: string;
  bio?: string;
  socialLinks?: {
    github?: string;
    twitter?: string;
    website?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export type IUserResponse = Omit<IUser, "password">;

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
