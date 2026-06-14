"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useCart, useUpsertCartItem } from "@/hooks/customer/useCart";
import { LoginPromptDialog } from "@/components/customer/LoginPromptDialog";
import { Loader2, Minus, Plus } from "lucide-react";

interface AddToCartButtonProps {
  menuItemId: number;
}

/**
 * Smart ADD button extracted as its own component (no inline components in list).
 * - Guest: opens LoginPromptDialog
 * - Authenticated + item not in cart: shows ADD button
 * - Authenticated + item in cart: shows − qty + stepper
 */
export function AddToCartButton({ menuItemId }: AddToCartButtonProps) {
  const { isAuthenticated } = useAuth();
  const { data: cart } = useCart();
  const upsert = useUpsertCartItem();

  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const cartItem = cart?.items.find((i) => i.menuItemId === menuItemId);
  const quantity = cartItem?.quantity ?? 0;
  const isLoading = upsert.isPending;

  const handleAdd = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    upsert.mutate({ menuItemId, quantity: quantity + 1 });
  };

  const handleDecrement = () => {
    if (quantity <= 0) return;
    upsert.mutate({ menuItemId, quantity: quantity - 1 });
  };

  return (
    <>
      {quantity > 0 ? (
        // ── Quantity stepper
        <div className="flex items-center gap-0 overflow-hidden rounded-lg border border-[#ea580c]">
          <button
            id={`cart-dec-${menuItemId}`}
            onClick={handleDecrement}
            disabled={isLoading}
            className="flex h-9 w-9 items-center justify-center bg-[#ea580c]/10 text-[#ea580c] transition-colors hover:bg-[#ea580c]/20 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Minus className="h-3.5 w-3.5" />
            )}
          </button>
          <span className="min-w-[28px] text-center text-sm font-bold text-[#ea580c]">
            {quantity}
          </span>
          <button
            id={`cart-inc-${menuItemId}`}
            onClick={handleAdd}
            disabled={isLoading}
            className="flex h-9 w-9 items-center justify-center bg-[#ea580c] text-white transition-colors hover:bg-[#c2410c] active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      ) : (
        // ── ADD button
        <button
          id={`add-to-cart-${menuItemId}`}
          onClick={handleAdd}
          disabled={isLoading}
          className="flex items-center gap-1 rounded-lg bg-[#ea580c] px-5 py-1.5 font-semibold text-white shadow-sm transition-colors hover:bg-[#c2410c] active:scale-95 disabled:opacity-60"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <span className="mb-[2px] text-lg leading-none font-light">+</span> ADD
            </>
          )}
        </button>
      )}

      <LoginPromptDialog
        open={showLoginPrompt}
        onOpenChange={setShowLoginPrompt}
      />
    </>
  );
}
