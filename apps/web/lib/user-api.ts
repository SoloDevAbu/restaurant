/**
 * Axios instance for customer-facing API calls.
 *
 * Uses separate cookies (userAccessToken / userRefreshToken) so admin
 * and customer sessions can coexist in the same browser without conflict.
 * Auto-refreshes via /api/user/auth/refresh.
 */
import axios from "axios";
import Cookies from "js-cookie";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const userApi = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// ─── Request interceptor ──────────────────────────────────────────────────
userApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = Cookies.get("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ─── Response interceptor — auto-refresh on 401 ───────────────────────────
userApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window !== "undefined") {
        const refreshToken = Cookies.get("refreshToken");

        if (refreshToken) {
          try {
            const { data } = await axios.post(
              `${API_URL}/user/auth/refresh`,
              { refreshToken },
            );

            const isProd = process.env.NODE_ENV === "production";
            Cookies.set("accessToken", data.accessToken, {
              secure: isProd,
              sameSite: "strict",
            });
            if (data.refreshToken) {
              Cookies.set("refreshToken", data.refreshToken, {
                secure: isProd,
                sameSite: "strict",
              });
            }

            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return userApi(originalRequest);
          } catch {
            // Refresh failed — clear user session silently
            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");
            
            // Dispatch a custom event so AuthContext can react
            window.dispatchEvent(new Event("user:session-expired"));
          }
        }
      }
    }

    return Promise.reject(error);
  },
);

/** Helper: persist auth to cookies */
export function persistAuth(data: {
  accessToken: string;
  refreshToken: string;
}) {
  const isProd = process.env.NODE_ENV === "production";
  Cookies.set("accessToken", data.accessToken, {
    secure: isProd,
    sameSite: "strict",
  });
  Cookies.set("refreshToken", data.refreshToken, {
    secure: isProd,
    sameSite: "strict",
  });
}

/** Helper: clear all user auth state */
export function clearPersistedAuth() {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
  
  // Clean up any old localStorage keys just in case
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem("userAuth");
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("accessKey");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("refreshKey");
  }
}
