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

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  data?: IUser;
  errorMessages?: Array<{ path: string; message: string }>;
}

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("devshare_token");
};

export const setAuthToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("devshare_token", token);
};

export const removeAuthToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("devshare_token");
};

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include", // send and receive HttpOnly cookies
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg =
      data.message || data.errorMessages?.[0]?.message || "Something went wrong";
    throw new Error(errorMsg);
  }

  return data;
}

export const registerApi = async (payload: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const loginApi = async (payload: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const logoutApi = async (): Promise<{ success: boolean; message: string }> => {
  return apiFetch("/auth/logout", {
    method: "POST",
  });
};

export const getMeApi = async (): Promise<{ success: boolean; data: IUser }> => {
  return apiFetch("/users/me", {
    method: "GET",
  });
};
