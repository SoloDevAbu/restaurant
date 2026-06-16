"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/lib/user-api";
import { useAuth } from "@/lib/auth-context";

// ─── Signup ───────────────────────────────────────────────────────────────

export interface SignupPayload {
  phone: string;
  name: string;
}

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: { id: number; name: string; phone: string };
}

export function useSignup() {
  const { setAuth } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SignupPayload) => {
      const { data } = await userApi.post<AuthResult>(
        "/user/auth/signup",
        payload,
      );
      return data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      queryClient.invalidateQueries({ queryKey: ["user", "cart"] });
    },
  });
}

// ─── Login ────────────────────────────────────────────────────────────────

export interface LoginPayload {
  phone: string;
}

export function useLogin() {
  const { setAuth } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await userApi.post<AuthResult>(
        "/user/auth/login",
        payload,
      );
      return data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      queryClient.invalidateQueries({ queryKey: ["user", "cart"] });
    },
  });
}

// ─── Logout ───────────────────────────────────────────────────────────────

export function useLogout() {
  const { clearAuth, refreshToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (refreshToken) {
        await userApi.post("/user/auth/logout", { refreshToken });
      }
    },
    onSuccess: () => {
      clearAuth();
      queryClient.removeQueries({ queryKey: ["user"] });
    },
    onError: () => {
      // Clear locally even if server call failed
      clearAuth();
      queryClient.removeQueries({ queryKey: ["user"] });
    },
  });
}
