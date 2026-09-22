import { ObjectId } from "mongodb";

export type BlogCategory =
  | "Frontend"
  | "Backend"
  | "DevOps"
  | "AI & Data"
  | "Security";

export type BlogStatus = "Draft" | "Published" | "Archived";

export type BlogBlockType = "h2" | "p" | "code" | "quote" | "image";

export interface IBlogBlock {
  id: string;
  type: BlogBlockType;
  content: string;
  metadata?: string;
}

export interface IBlogAuthor {
  id: string;
  name: string;
  avatar?: string;
  title?: string;
}

export interface IBlog {
  _id?: ObjectId;
  title: string;
  slug: string;
  description: string;
  category: BlogCategory;
  tags?: string[];
  coverImage?: string;
  blocks: IBlogBlock[];
  author: IBlogAuthor;
  authorId: ObjectId;
  status: BlogStatus;
  readTime: string;
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateBlogPayload {
  title: string;
  description: string;
  category: BlogCategory;
  blocks: IBlogBlock[];
  status?: BlogStatus;
  coverImage?: string;
  tags?: string[];
}

export interface IUpdateBlogPayload {
  title?: string;
  description?: string;
  category?: BlogCategory;
  blocks?: IBlogBlock[];
  status?: BlogStatus;
  coverImage?: string;
  tags?: string[];
}

export interface IBlogFilterQuery {
  category?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "views" | "likes";
  sortOrder?: "asc" | "desc";
}
