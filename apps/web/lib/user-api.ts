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
    let token = Cookies.get("userAccessToken");
    
    // Fallback to localStorage if cookie is not set (e.g. secure:true on localhost)
    if (!token) {
      try {
        const raw = localStorage.getItem("userAuth");
        if (raw) {
          const parsed = JSON.parse(raw);
          token = parsed.accessToken;
        }
      } catch (e) {
        // ignore
      }
    }
    
    // Fallback for custom keys the user mentioned
    if (!token) {
      token = localStorage.getItem("accessToken") || localStorage.getItem("accessKey") || undefined;
    }

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
        let refreshToken = Cookies.get("userRefreshToken");

        if (!refreshToken) {
          try {
            const raw = localStorage.getItem("userAuth");
            if (raw) {
              const parsed = JSON.parse(raw);
              refreshToken = parsed.refreshToken;
            }
          } catch (e) {}
        }
        
        if (!refreshToken) {
          refreshToken = localStorage.getItem("refreshToken") || localStorage.getItem("refreshKey") || undefined;
        }

        if (refreshToken) {
          try {
            const { data } = await axios.post(
              `${API_URL}/user/auth/refresh`,
              { refreshToken },
            );

            const isProd = process.env.NODE_ENV === "production";
            Cookies.set("userAccessToken", data.accessToken, {
              secure: isProd,
              sameSite: "strict",
            });
            if (data.refreshToken) {
              Cookies.set("userRefreshToken", data.refreshToken, {
                secure: isProd,
                sameSite: "strict",
              });
            }

            // Also update localStorage
            try {
              const raw = localStorage.getItem("userAuth");
              if (raw) {
                const parsed = JSON.parse(raw);
                parsed.accessToken = data.accessToken;
                if (data.refreshToken) parsed.refreshToken = data.refreshToken;
                localStorage.setItem("userAuth", JSON.stringify(parsed));
              }
            } catch (e) {}

            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return userApi(originalRequest);
          } catch {
            // Refresh failed — clear user session silently
            Cookies.remove("userAccessToken");
            Cookies.remove("userRefreshToken");
            if (typeof localStorage !== "undefined") {
              localStorage.removeItem("userAuth");
              localStorage.removeItem("accessToken");
              localStorage.removeItem("accessKey");
              localStorage.removeItem("refreshToken");
              localStorage.removeItem("refreshKey");
            }
            // Dispatch a custom event so AuthContext can react
            window.dispatchEvent(new Event("user:session-expired"));
          }
        }
      }
    }

    return Promise.reject(error);
  },
);

/** Helper: read the stored user auth from localStorage */
export function getStoredAuth() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("userAuth");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Helper: persist user auth to localStorage + cookies */
export function persistAuth(data: {
  user: { id: number; name: string; phone: string };
  accessToken: string;
  refreshToken: string;
}) {
  localStorage.setItem("userAuth", JSON.stringify(data));
  // also set the raw keys in case that is what's expected
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("accessKey", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  localStorage.setItem("refreshKey", data.refreshToken);

  const isProd = process.env.NODE_ENV === "production";
  Cookies.set("userAccessToken", data.accessToken, {
    secure: isProd,
    sameSite: "strict",
  });
  Cookies.set("userRefreshToken", data.refreshToken, {
    secure: isProd,
    sameSite: "strict",
  });
}

/** Helper: clear all user auth state */
export function clearPersistedAuth() {
  localStorage.removeItem("userAuth");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("accessKey");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("refreshKey");
  Cookies.remove("userAccessToken");
  Cookies.remove("userRefreshToken");
}
