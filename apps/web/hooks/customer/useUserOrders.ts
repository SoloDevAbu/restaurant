"use client";

import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/lib/user-api";
import { useAuth } from "@/lib/auth-context";

export interface OrderItem {
  id: number;
  menuItemId: number;
  itemName: string;
  quantity: number;
  unitPrice: string;
}

export interface UserOrder {
  id: string;
  customerId: number | null;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  notes: string | null;
  status: string;
  totalAmount: string;
  estimatedMinutes: number | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export function useUserOrders() {
  const { isAuthenticated } = useAuth();

  return useQuery<UserOrder[]>({
    queryKey: ["user", "orders"],
    queryFn: async () => {
      const { data } = await userApi.get<UserOrder[]>("/user/orders");
      return data;
    },
    enabled: isAuthenticated,
  });
}
