import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/api";
import { socket } from "../lib/socket";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.get("/auth/me");

      setUser(res.data.data);
      setIsAuthenticated(true);
      socket.connect();
    } catch (err) {
      console.error("Auth check failed:", err);
      localStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
    }

    setIsLoading(false);
  };

  const login = (token: string, userData: User) => {
    localStorage.setItem("token", token);

    setUser(userData);
    setIsAuthenticated(true);

    socket.connect();
  };

  const logout = () => {
    localStorage.removeItem("token");

    setUser(null);
    setIsAuthenticated(false);

    socket.disconnect();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        isLoading,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}