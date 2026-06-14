"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { getStoredAuth, persistAuth, clearPersistedAuth } from "./user-api";

// ─── Types ────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number;
  name: string;
  phone: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean; // false until localStorage is read on client
}

interface AuthContextType extends AuthState {
  setAuth: (
    user: AuthUser,
    accessToken: string,
    refreshToken: string,
  ) => void;
  clearAuth: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isHydrated: false,
  });

  // Hydrate from localStorage on first mount
  useEffect(() => {
    const stored = getStoredAuth();
    if (stored?.user && stored?.accessToken) {
      setState({
        user: stored.user,
        accessToken: stored.accessToken,
        refreshToken: stored.refreshToken,
        isAuthenticated: true,
        isHydrated: true,
      });
    } else {
      setState((s) => ({ ...s, isHydrated: true }));
    }
  }, []);

  // Listen for session-expired events fired by the axios interceptor
  useEffect(() => {
    const handler = () => {
      setState({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isHydrated: true,
      });
    };
    window.addEventListener("user:session-expired", handler);
    return () => window.removeEventListener("user:session-expired", handler);
  }, []);

  const setAuth = useCallback(
    (user: AuthUser, accessToken: string, refreshToken: string) => {
      persistAuth({ user, accessToken, refreshToken });
      setState({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isHydrated: true,
      });
    },
    [],
  );

  const clearAuth = useCallback(() => {
    clearPersistedAuth();
    setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isHydrated: true,
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
