"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { loginRequest, type AuthSession, type LoginInput } from "../../lib/api";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  login: (input: LoginInput) => Promise<void>;
  logout: () => void;
  session: AuthSession | null;
  status: AuthStatus;
};

const AUTH_STORAGE_KEY = "chales.session";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(AUTH_STORAGE_KEY);

      if (!storedValue) {
        setStatus("unauthenticated");
        return;
      }

      const parsed = JSON.parse(storedValue) as AuthSession;
      if (parsed?.token && parsed?.user) {
        setSession(parsed);
        setStatus("authenticated");
      } else {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
        setStatus("unauthenticated");
      }
    } catch {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      setStatus("unauthenticated");
    }
  }, []);

  const value: AuthContextValue = {
    async login(input) {
      const nextSession = await loginRequest(input);
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
      setSession(nextSession);
      setStatus("authenticated");
    },
    logout() {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      setSession(null);
      setStatus("unauthenticated");
    },
    session,
    status
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth precisa ser usado dentro de AuthProvider");
  }

  return context;
}
