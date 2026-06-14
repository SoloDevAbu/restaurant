import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useOrders = (filters?: {
  page?: number;
  limit?: number;
  status?: string;
  date?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["admin", "orders", filters],
    queryFn: async () => {
      const { data } = await api.get("/admin/orders", { params: filters });
      return data;
    },
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ["admin", "orders", id],
    queryFn: async () => {
      const { data } = await api.get(`/admin/orders/${id}`);
      return data;
    },
    enabled: !!id, // Only fetch if ID is provided
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      deliveryManId,
      estimatedMinutes,
    }: {
      id: string;
      status: string;
      deliveryManId?: number;
      estimatedMinutes?: number;
    }) => {
      const { data } = await api.patch(`/admin/orders/${id}/status`, {
        status,
        deliveryManId,
        estimatedMinutes,
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({
        queryKey: ["admin", "orders", variables.id],
      });
    },
  });
};
