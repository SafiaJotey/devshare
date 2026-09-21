export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar?: string;
  title?: string;
  bio?: string;
  socialLinks?: {
    github?: string;
    twitter?: string;
    website?: string;
  };
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

export const changePasswordApi = async (payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<ApiResponse<null>> => {
  return apiFetch<ApiResponse<null>>("/users/change-password", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
};


