import React, { createContext, useEffect, useState, ReactNode } from "react";
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
  email: string;
  role: "PATIENT" | "PROVIDER";
  accountId: string;
  exp: number;
}

interface AuthContextType {
  token: string | null;
  role: string | null;
  email: string | null;
  userId: string | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode<DecodedToken>(storedToken);
        const isExpired = decoded.exp * 1000 < Date.now();
        if (!isExpired) {
          setToken(storedToken);
          setRole(decoded.role);
          setEmail(decoded.email);
          setUserId(decoded.accountId);
        } else {
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Invalid JWT token:", error);
        localStorage.removeItem("token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    const decoded = jwtDecode<DecodedToken>(newToken);
    setToken(newToken);
    setRole(decoded.role);
    setEmail(decoded.email);
    setUserId(decoded.accountId);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setRole(null);
    setEmail(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, email, userId,isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
