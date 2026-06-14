import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useCategories = () => {
  return useQuery({
    queryKey: ["customer", "categories"],
    queryFn: async () => {
      const { data } = await api.get("/categories");
      return data;
    },
  });
};
