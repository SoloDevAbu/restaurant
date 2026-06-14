import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["admin", "dashboard", "stats"],
    queryFn: async () => {
      const { data } = await api.get("/admin/dashboard");
      return data;
    },
  });
};
