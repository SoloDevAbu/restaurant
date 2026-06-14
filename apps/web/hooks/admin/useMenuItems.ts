import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { UpdateMenuItemBody } from "@repo/types";

export const useMenuItems = (filters?: {
  categoryId?: number;
  isFeatured?: boolean;
  dietType?: string;
  isAvailable?: boolean;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["admin", "menu-items", filters],
    queryFn: async () => {
      const { data } = await api.get("/admin/menu-items", { params: filters });
      return data;
    },
  });
};

export const useMenuItem = (id: number) => {
  return useQuery({
    queryKey: ["admin", "menu-items", id],
    queryFn: async () => {
      const { data } = await api.get(`/admin/menu-items/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemData: {
      categoryId: number;
      name: string;
      description?: string;
      price: string;
      imageUrl?: string;
      isAvailable?: boolean;
      isFeatured?: boolean;
      featuredTag?: string;
      dietType?: string;
      displayOrder?: number;
    }) => {
      const { data } = await api.post("/admin/menu-items", itemData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "menu-items"] });
    },
  });
};

export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updateData
    }: UpdateMenuItemBody & { id: number }) => {
      const { data } = await api.patch(`/admin/menu-items/${id}`, updateData);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "menu-items"] });
      queryClient.invalidateQueries({
        queryKey: ["admin", "menu-items", variables.id],
      });
    },
  });
};

export const useToggleMenuItemAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      isAvailable,
    }: {
      id: number;
      isAvailable: boolean;
    }) => {
      const { data } = await api.patch(`/admin/menu-items/${id}/availability`, {
        isAvailable,
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "menu-items"] });
      queryClient.invalidateQueries({
        queryKey: ["admin", "menu-items", variables.id],
      });
    },
  });
};

export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(`/admin/menu-items/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "menu-items"] });
    },
  });
};
