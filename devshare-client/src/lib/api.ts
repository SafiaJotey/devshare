export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export interface IContributorPreferences {
  defaultCategory?: "Frontend" | "Backend" | "DevOps" | "AI/ML" | "Security" | string;
  codeFont?: "jetbrains" | "fira" | "mono" | string;
  autoSave?: boolean;
  emailOnComment?: boolean;
  emailOnLike?: boolean;
  weeklyDigest?: boolean;
  showInLeaderboard?: boolean;
  publicEmail?: boolean;
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar?: string;
  title?: string;
  bio?: string;
  primaryDomain?: string;
  skills?: string[];
  socialLinks?: {
    github?: string;
    twitter?: string;
    website?: string;
    linkedin?: string;
  };
  preferences?: IContributorPreferences;
  provider?: string;
  lastLoginAt?: string;
  createdAt?: string;
}

export interface IErrorSource {
  path: string;
  message: string;
}

export interface ApiResponse<T = any> {
  statusCode?: number;
  success: boolean;
  message?: string;
  data?: T;
  errorSources?: IErrorSource[];
  errorMessages?: IErrorSource[];
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // send and receive HttpOnly cookies
  });

  // If 401 Unauthorized and not already refreshing or calling auth endpoints
  const isAuthEndpoint =
    endpoint.startsWith("/auth/login") ||
    endpoint.startsWith("/auth/register") ||
    endpoint.startsWith("/auth/social-login") ||
    endpoint.startsWith("/auth/refresh-token") ||
    endpoint.startsWith("/auth/logout");

  if (response.status === 401 && !isAuthEndpoint) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => apiFetch<T>(endpoint, options));
    }

    isRefreshing = true;

    try {
      const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!refreshRes.ok) {
        throw new Error("Session expired");
      }

      processQueue(null);
      return apiFetch<T>(endpoint, options);
    } catch (refreshErr) {
      processQueue(refreshErr as Error);
      throw new Error("Session expired. Please log in again.");
    } finally {
      isRefreshing = false;
    }
  }

  let data: ApiResponse<T>;
  try {
    data = await response.json();
  } catch {
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return {} as T;
  }

  if (!response.ok || data.success === false) {
    // Extract the most descriptive error message from errorSources or message
    let errorMsg = data.message || "An unexpected error occurred.";
    if (data.errorSources && data.errorSources.length > 0) {
      errorMsg = data.errorSources[0].message;
    } else if (data.errorMessages && data.errorMessages.length > 0) {
      errorMsg = data.errorMessages[0].message;
    }
    throw new Error(errorMsg);
  }

  return data as unknown as T;
}

export const registerApi = async (payload: {
  name: string;
  email: string;
  password: string;
}): Promise<ApiResponse<IUser>> => {
  return apiFetch<ApiResponse<IUser>>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const loginApi = async (payload: {
  email: string;
  password: string;
}): Promise<ApiResponse<IUser>> => {
  return apiFetch<ApiResponse<IUser>>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const socialLoginApi = async (payload: {
  email: string;
  name: string;
  avatar?: string;
  provider: "google" | "facebook" | string;
  idToken?: string;
}): Promise<ApiResponse<IUser>> => {
  return apiFetch<ApiResponse<IUser>>("/auth/social-login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const logoutApi = async (): Promise<ApiResponse<null>> => {
  return apiFetch<ApiResponse<null>>("/auth/logout", {
    method: "POST",
  });
};

export const refreshTokenApi = async (): Promise<ApiResponse<IUser>> => {
  return apiFetch<ApiResponse<IUser>>("/auth/refresh-token", {
    method: "POST",
  });
};

export const getMeApi = async (): Promise<ApiResponse<IUser>> => {
  return apiFetch<ApiResponse<IUser>>("/users/me", {
    method: "GET",
  });
};

export const updateProfileApi = async (
  payload: Partial<IUser>
): Promise<ApiResponse<IUser>> => {
  return apiFetch<ApiResponse<IUser>>("/users/profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
};

export const uploadProfileAvatarApi = async (
  avatar: string
): Promise<ApiResponse<IUser>> => {
  return apiFetch<ApiResponse<IUser>>("/users/profile/avatar", {
    method: "PATCH",
    body: JSON.stringify({ avatar }),
  });
};

export const changePasswordApi = async (payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<ApiResponse<null>> => {
  return apiFetch<ApiResponse<null>>("/users/change-password", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
};

export const revokeOtherSessionsApi = async (): Promise<ApiResponse<null>> => {
  return apiFetch<ApiResponse<null>>("/users/revoke-sessions", {
    method: "POST",
  });
};

export const deleteAccountApi = async (payload?: {
  password?: string;
}): Promise<ApiResponse<null>> => {
  return apiFetch<ApiResponse<null>>("/users/account", {
    method: "DELETE",
    body: payload ? JSON.stringify(payload) : undefined,
  });
};

export interface IContributor {
  _id: string;
  name: string;
  avatar?: string;
  title?: string;
  bio?: string;
  primaryDomain?: string;
  skills?: string[];
  socialLinks?: IUser["socialLinks"];
  totalArticles: number;
  totalViews: number;
  totalLikes: number;
  email?: string;
}

export interface IAuthorDetailsResponse {
  author: {
    _id: string;
    name: string;
    username: string;
    title: string;
    avatar: string;
    bio: string;
    primaryDomain: string;
    skills: string[];
    socialLinks: {
      github?: string;
      twitter?: string;
      linkedin?: string;
      website?: string;
    };
    location: string;
    joinedDate: string;
    email?: string;
  };
  stats: {
    totalArticles: number;
    totalViews: number;
    totalLikes: number;
    followers: number;
  };
  articles: IBlog[];
}

export const getContributorsApi = async (
  limit: number = 8
): Promise<ApiResponse<IContributor[]>> => {
  return apiFetch<ApiResponse<IContributor[]>>(`/users/contributors?limit=${limit}`, {
    method: "GET",
  });
};

export const getAuthorDetailsApi = async (
  authorId: string
): Promise<ApiResponse<IAuthorDetailsResponse>> => {
  return apiFetch<ApiResponse<IAuthorDetailsResponse>>(
    `/users/author/${encodeURIComponent(authorId)}`,
    {
      method: "GET",
    }
  );
};

export const getCategoryStatsApi = async (): Promise<ApiResponse<Record<string, number>>> => {
  return apiFetch<ApiResponse<Record<string, number>>>("/blogs/categories/stats", {
    method: "GET",
  });
};

// ─── Blog Types & API Endpoints ───────────────────────────────────────────────

export type BlogCategory =
  | "Frontend"
  | "Backend"
  | "DevOps"
  | "AI/ML"
  | "Security";

export type BlogBlockType =
  | "p"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "ul"
  | "ol"
  | "code"
  | "quote"
  | "image"
  | "layout";

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
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: BlogCategory;
  tags?: string[];
  coverImage?: string;
  blocks: IBlogBlock[];
  author: IBlogAuthor;
  authorId: string;
  status: "Draft" | "Published" | "Archived";
  readTime: string;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateBlogPayload {
  title: string;
  description: string;
  category: string;
  blocks: IBlogBlock[];
  status?: "Draft" | "Published";
  coverImage?: string;
  tags?: string[];
}

export interface IUpdateBlogPayload {
  title?: string;
  description?: string;
  category?: string;
  blocks?: IBlogBlock[];
  status?: IBlog["status"];
  coverImage?: string;
  tags?: string[];
}

export interface IPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IBlogsListResponse {
  statusCode: number;
  success: boolean;
  message?: string;
  data: IBlog[];
  meta: IPaginationMeta;
}

export const createBlogApi = async (
  payload: ICreateBlogPayload
): Promise<ApiResponse<IBlog>> => {
  return apiFetch<ApiResponse<IBlog>>("/blogs", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const getBlogsApi = async (
  params: Record<string, string | number | undefined> = {}
): Promise<IBlogsListResponse> => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  const endpoint = queryString ? `/blogs?${queryString}` : "/blogs";
  return apiFetch<IBlogsListResponse>(endpoint, {
    method: "GET",
  });
};

export const getBlogByIdApi = async (
  idOrSlug: string
): Promise<ApiResponse<IBlog>> => {
  return apiFetch<ApiResponse<IBlog>>(`/blogs/${encodeURIComponent(idOrSlug)}`, {
    method: "GET",
  });
};

export const getMyBlogsApi = async (
  params: Record<string, string | number | undefined> = {}
): Promise<IBlogsListResponse> => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  const endpoint = queryString ? `/blogs/my/blogs?${queryString}` : "/blogs/my/blogs";
  return apiFetch<IBlogsListResponse>(endpoint, {
    method: "GET",
  });
};

export const getMyBlogByIdApi = async (
  id: string
): Promise<ApiResponse<IBlog>> => {
  return apiFetch<ApiResponse<IBlog>>(`/blogs/my/blogs/${encodeURIComponent(id)}`, {
    method: "GET",
  });
};

export const deleteBlogApi = async (
  id: string
): Promise<ApiResponse<null>> => {
  return apiFetch<ApiResponse<null>>(`/blogs/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
};

export const updateBlogStatusApi = async (
  id: string,
  status: IBlog["status"]
): Promise<ApiResponse<IBlog>> => {
  return updateBlogApi(id, { status });
};

export const updateBlogApi = async (
  id: string,
  payload: IUpdateBlogPayload
): Promise<ApiResponse<IBlog>> => {
  return apiFetch<ApiResponse<IBlog>>(`/blogs/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
};

// ─── Blog Interactions ──────────────────────────────────────────────────────────

export interface IBlogInteractionState {
  liked: boolean;
  saved: boolean;
  likes: number;
}

export const getBlogInteractionStateApi = async (
  id: string
): Promise<ApiResponse<IBlogInteractionState>> => {
  return apiFetch<ApiResponse<IBlogInteractionState>>(
    `/blogs/${encodeURIComponent(id)}/interactions`,
    { method: "GET" }
  );
};

export const toggleLikeApi = async (
  id: string
): Promise<ApiResponse<{ liked: boolean; likes: number }>> => {
  return apiFetch<ApiResponse<{ liked: boolean; likes: number }>>(
    `/blogs/${encodeURIComponent(id)}/like`,
    { method: "POST" }
  );
};

export const toggleSaveApi = async (
  id: string
): Promise<ApiResponse<{ saved: boolean }>> => {
  return apiFetch<ApiResponse<{ saved: boolean }>>(
    `/blogs/${encodeURIComponent(id)}/save`,
    { method: "POST" }
  );
};

// ─── Blog Comments ─────────────────────────────────────────────────────────────

export interface IBlogComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}

export const addCommentApi = async (
  blogId: string,
  content: string
): Promise<ApiResponse<IBlogComment[]>> => {
  return apiFetch<ApiResponse<IBlogComment[]>>(
    `/blogs/${encodeURIComponent(blogId)}/comments`,
    {
      method: "POST",
      body: JSON.stringify({ content }),
    }
  );
};

export const deleteCommentApi = async (
  blogId: string,
  commentId: string
): Promise<ApiResponse<null>> => {
  return apiFetch<ApiResponse<null>>(
    `/blogs/${encodeURIComponent(blogId)}/comments/${encodeURIComponent(commentId)}`,
    { method: "DELETE" }
  );
};

// ─── Related Blogs ─────────────────────────────────────────────────────────────

export const getRelatedBlogsApi = async (
  blogId: string,
  category: string,
  limit = 3
): Promise<ApiResponse<IBlog[]>> => {
  return apiFetch<ApiResponse<IBlog[]>>(
    `/blogs/${encodeURIComponent(blogId)}/related?category=${encodeURIComponent(category)}&limit=${limit}`,
    { method: "GET" }
  );
};
