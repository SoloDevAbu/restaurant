"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/lib/user-api";
import { useAuth } from "@/lib/auth-context";

// ─── Request OTP ──────────────────────────────────────────────────────────

export function useRequestOtp() {
  return useMutation({
    mutationFn: async (phone: string) => {
      const { data } = await userApi.post("/user/auth/request-otp", { phone });
      return data as { message: string };
    },
  });
}

// ─── Verify OTP + auto-login ──────────────────────────────────────────────

export interface VerifyOtpPayload {
  phone: string;
  otp: string;
  name?: string;
}

export interface VerifyOtpResult {
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean;
  user: { id: number; name: string; phone: string };
}

export function useVerifyOtp() {
  const { setAuth } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: VerifyOtpPayload) => {
      const { data } = await userApi.post<VerifyOtpResult>(
        "/user/auth/verify-otp",
        payload,
      );
      return data;
    },
    onSuccess: (data) => {
      if (data.accessToken) {
        setAuth(data.user, data.accessToken, data.refreshToken);
        // Refresh cart after login so badge shows real count
        queryClient.invalidateQueries({ queryKey: ["user", "cart"] });
      }
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
