"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/lib/user-api";
import { useAuth } from "@/lib/auth-context";

export interface UserAddress {
  id: number;
  userId: number;
  address: string;
  pincode: string;
  landmark: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SaveAddressPayload {
  address: string;
  pincode: string;
  landmark?: string;
}

export function useAddress() {
  const { isAuthenticated } = useAuth();

  return useQuery<UserAddress | null>({
    queryKey: ["user", "address"],
    queryFn: async () => {
      try {
        const { data } = await userApi.get<UserAddress>("/user/address");
        return data;
      } catch (err: any) {
        if (err?.response?.status === 404) return null;
        throw err;
      }
    },
    enabled: isAuthenticated,
  });
}

export function useSaveAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SaveAddressPayload) => {
      const { data } = await userApi.put<UserAddress>("/user/address", payload);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["user", "address"], data);
    },
  });
}
