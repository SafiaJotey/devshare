"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  IUser,
  getMeApi,
  loginApi,
  logoutApi,
  registerApi,
  socialLoginApi,
} from "@/lib/api";
import { signInWithSocial, auth as firebaseAuth } from "@/lib/firebase";
import { signOut as firebaseSignOut } from "firebase/auth";

interface AuthContextType {
  user: IUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithSocial: (provider: "google" | "facebook") => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await getMeApi();
      if (res.success && res.data) {
        setUser(res.data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check session on initial load
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await loginApi({ email, password });
      if (res.data) {
        setUser(res.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithSocial = async (provider: "google" | "facebook") => {
    setIsLoading(true);
    try {
      const socialUser = await signInWithSocial(provider);
      const res = await socialLoginApi({
        email: socialUser.email,
        name: socialUser.name,
        avatar: socialUser.avatar,
        provider: socialUser.provider,
        idToken: socialUser.idToken,
      });
      if (res.data) {
        setUser(res.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await registerApi({ name, email, password });
      if (res.data) {
        setUser(res.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
      try {
        await firebaseSignOut(firebaseAuth);
      } catch {
        // Ignore firebase signOut if not signed in with firebase
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        login,
        loginWithSocial,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
