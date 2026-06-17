import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Cookies from "js-cookie";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data } = await api.post("/auth/login", credentials);
      return data;
    },
    onSuccess: (data) => {
      const isProd = process.env.NODE_ENV === "production";
      Cookies.set("accessToken", data.accessToken, { secure: isProd, sameSite: 'strict' });
      if (data.refreshToken) {
        Cookies.set("refreshToken", data.refreshToken, { secure: isProd, sameSite: 'strict' });
      }
      queryClient.setQueryData(["session"], data.user);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const refreshToken = Cookies.get("refreshToken");
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken });
      }
    },
    onSuccess: () => {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      queryClient.setQueryData(["session"], null);
      queryClient.clear();
      window.location.href = "/login";
    },
    onError: () => {
      // Force clear state anyway if logout fails
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      queryClient.clear();
      window.location.href = "/login";
    },
  });
};

export const useSession = () => {
  return useQuery({
    queryKey: ["session"],
    queryFn: () => {
      if (typeof window !== "undefined") {
        const token = Cookies.get("accessToken");
        return token ? { isAuthenticated: true } : null;
      }
      return null;
    },
    staleTime: Infinity, // The session won't be considered stale until logout
  });
};
