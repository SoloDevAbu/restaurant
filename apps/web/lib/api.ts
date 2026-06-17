import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach access token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    let token = Cookies.get("accessToken");
    
    if (!token) {
      try {
        const raw = localStorage.getItem("adminAuth");
        if (raw) {
          const parsed = JSON.parse(raw);
          token = parsed.accessToken;
        }
      } catch (e) {}
    }
    
    if (!token) {
      token = localStorage.getItem("accessToken") || localStorage.getItem("accessKey") || undefined;
    }

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response Interceptor: Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      if (typeof window !== "undefined") {
        let refreshToken = Cookies.get("refreshToken");
        
        if (!refreshToken) {
          try {
            const raw = localStorage.getItem("adminAuth");
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
            const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
            
            // Save new tokens
            const isProd = process.env.NODE_ENV === "production";
            Cookies.set("accessToken", data.accessToken, { secure: isProd, sameSite: 'strict' });
            if (data.refreshToken) {
              Cookies.set("refreshToken", data.refreshToken, { secure: isProd, sameSite: 'strict' });
            }
            
            try {
              const raw = localStorage.getItem("adminAuth");
              if (raw) {
                const parsed = JSON.parse(raw);
                parsed.accessToken = data.accessToken;
                if (data.refreshToken) parsed.refreshToken = data.refreshToken;
                localStorage.setItem("adminAuth", JSON.stringify(parsed));
              }
            } catch (e) {}
            
            // Update auth header and retry original request
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            // Refresh failed, logout user
            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");
            if (typeof localStorage !== "undefined") {
              localStorage.removeItem("adminAuth");
              localStorage.removeItem("accessToken");
              localStorage.removeItem("accessKey");
              localStorage.removeItem("refreshToken");
              localStorage.removeItem("refreshKey");
            }
            window.location.href = "/login"; // Adjust to your login route
            return Promise.reject(refreshError);
          }
        }
      }
    }
    
    return Promise.reject(error);
  }
);
