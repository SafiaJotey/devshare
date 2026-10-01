import { ObjectId } from "mongodb";

export type BlogCategory =
  | "Frontend"
  | "Backend"
  | "DevOps"
  | "AI/ML"
  | "Security";

export type BlogStatus = "Draft" | "Published" | "Archived";

export type BlogBlockType = "h2" | "p" | "code" | "quote" | "image" | "layout" | "h3" | "h4" | "h5" | "h6" | "ul" | "ol";

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

export interface IBlogComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: Date;
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
  likesBy?: string[]; // array of userId strings who liked
  savedBy?: string[]; // array of userId strings who saved
  comments?: IBlogComment[];
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
  sortBy?: "createdAt" | "views" | "likes" | "featured" | "popular" | string;
  sortOrder?: "asc" | "desc";
}
