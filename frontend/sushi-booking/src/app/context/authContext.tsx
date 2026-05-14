"use client";

import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
  useContext,
  useCallback,
} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface User {
  id: string | number;
  name: string;
  email: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  isAuthenticated: boolean;
  login: (token: string, returnUrl?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  refreshAuth: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const clearAuthData = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth");
    }
    Cookies.remove("access_token");
    Cookies.remove("user_info");
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const validateToken = useCallback(async (token: string) => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000, // Tăng timeout lên 10 giây
      });
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          console.warn("Request timed out");
          return null;
        }
        if (error.response?.status === 401) {
          console.warn("Token không hợp lệ hoặc đã hết hạn");
          return null;
        }
      }
      console.error("Lỗi validateToken:", error);
      return null;
    }
  }, []);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        setIsLoading(true);

        let token: string | null = null;
        if (typeof window !== "undefined") {
          const query = new URLSearchParams(window.location.search);
          const urlToken = query.get("token");

          if (urlToken) {
            localStorage.setItem("auth", urlToken);
            const url = new URL(window.location.href);
            url.searchParams.delete("token");
            window.history.replaceState({}, "", url.toString());
            token = urlToken;
          } else {
            token = localStorage.getItem("auth");
          }
        }

        if (token) {
          const userData = await validateToken(token);
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
            Cookies.set("access_token", token, { path: "/" });
            Cookies.set("user_info", JSON.stringify(userData), { path: "/" });
          } else {
            clearAuthData();
          }
        } else {
          clearAuthData();
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        clearAuthData();
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    checkAuthState();
  }, [router, clearAuthData, validateToken]);

  const login = useCallback(
    async (token: string, returnUrl?: string): Promise<void> => {
      try {
        setIsLoading(true);

        if (typeof window !== "undefined") {
          localStorage.setItem("auth", token);
        }

        const userData = await validateToken(token);
        if (!userData) {
          throw new Error("Token không hợp lệ hoặc đã hết hạn");
        }

        setUser(userData);
        setIsAuthenticated(true);
        Cookies.set("access_token", token, { path: "/" });
        Cookies.set("user_info", JSON.stringify(userData), { path: "/" });

        router.replace(returnUrl || "/");
      } catch (error) {
        console.error("Login failed:", error);
        clearAuthData();
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [router, clearAuthData, validateToken]
  );

  const logout = useCallback(async (): Promise<void> => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("auth") : null;

    try {
      if (token) {
        await axios.get("http://127.0.0.1:8000/api/logout", {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (error) {
      console.warn("Logout API failed hoặc token đã hết hạn:", error);
    } finally {
      clearAuthData();
      router.replace("/dang-nhap");
    }
  }, [clearAuthData, router]);

  const updateUser = useCallback((userData: Partial<User>) => {
    setUser((prevUser) => (prevUser ? { ...prevUser, ...userData } : prevUser));
  }, []);

  const refreshAuth = useCallback(async () => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("auth") : null;
      if (token) {
        const userData = await validateToken(token);
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          clearAuthData();
        }
      } else {
        clearAuthData();
      }
    } catch (error) {
      console.error("Error refreshing auth:", error);
      clearAuthData();
    }
  }, [clearAuthData, validateToken]);

  const contextValue: AuthContextType = {
    user,
    isLoading,
    isInitialized,
    isAuthenticated,
    login,
    logout,
    updateUser,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
