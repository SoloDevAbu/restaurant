import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useMenu = () => {
  return useQuery({
    queryKey: ["customer", "menu"],
    queryFn: async () => {
      const { data } = await api.get("/menu");
      return data;
    },
  });
};

export const useFeaturedMenu = () => {
  return useQuery({
    queryKey: ["customer", "menu", "featured"],
    queryFn: async () => {
      const { data } = await api.get("/menu/featured");
      return data;
    },
  });
};

export const useMenuItems = (filters?: { categoryId?: number; dietType?: string; search?: string }) => {
  return useQuery({
    queryKey: ["customer", "menu", "items", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.categoryId) params.append("categoryId", filters.categoryId.toString());
      if (filters?.dietType && filters.dietType !== "all") params.append("dietType", filters.dietType);
      if (filters?.search) params.append("search", filters.search);
      
      const { data } = await api.get(`/menu/items?${params.toString()}`);
      return data;
    },
  });
};

