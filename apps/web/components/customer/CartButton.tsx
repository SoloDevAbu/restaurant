"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/customer/useCart";
import { useAuth } from "@/lib/auth-context";

/**
 * Cart icon with distinct-item count badge.
 * Shows count of unique items (not total quantity) per user request.
 */
export function CartButton() {
  const { isAuthenticated } = useAuth();
  const { data: cart } = useCart();

  const distinctCount = isAuthenticated ? (cart?.items.length ?? 0) : 0;

  return (
    <Link
      href="/cart"
      id="navbar-cart-btn"
      className="relative flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent"
    >
      <ShoppingCart className="h-5 w-5" />
      {distinctCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#ea580c] text-[10px] font-bold text-white shadow-sm">
          {distinctCount > 9 ? "9+" : distinctCount}
        </span>
      )}
    </Link>
  );
}
