"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/lib/user-api";
import { useAuth } from "@/lib/auth-context";

// ─── Types ────────────────────────────────────────────────────────────────

export interface CartItem {
  id: number;
  menuItemId: number;
  quantity: number;
  name: string;
  price: string;
  imageUrl: string | null;
  isAvailable: boolean;
}

export interface CartData {
  items: CartItem[];
  total: string;
  itemCount: number;
}

// ─── Queries ──────────────────────────────────────────────────────────────

/** Fetches cart from server. Only runs when user is authenticated. */
export function useCart() {
  const { isAuthenticated } = useAuth();

  return useQuery<CartData>({
    queryKey: ["user", "cart"],
    queryFn: async () => {
      const { data } = await userApi.get<CartData>("/user/cart");
      return data;
    },
    enabled: isAuthenticated,
    staleTime: 30 * 1000, // 30s
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────

/** Add or update item quantity in cart. quantity=0 removes the item. */
export function useUpsertCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      menuItemId,
      quantity,
    }: {
      menuItemId: number;
      quantity: number;
    }) => {
      const { data } = await userApi.post("/user/cart", {
        menuItemId,
        quantity,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "cart"] });
    },
  });
}

/** Remove a single item from cart */
export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (menuItemId: number) => {
      const { data } = await userApi.delete(`/user/cart/${menuItemId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "cart"] });
    },
  });
}

/** Clear entire cart */
export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await userApi.delete("/user/cart");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "cart"] });
    },
  });
}

/** Checkout: place order from cart */
export function useCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notes?: string) => {
      const { data } = await userApi.post("/user/orders", { notes });
      return data;
    },
    onSuccess: () => {
      // Cart is cleared server-side; invalidate so badge updates
      queryClient.invalidateQueries({ queryKey: ["user", "cart"] });
      queryClient.invalidateQueries({ queryKey: ["user", "orders"] });
    },
  });
}
