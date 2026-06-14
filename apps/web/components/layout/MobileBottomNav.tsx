"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Utensils, ClipboardList, ShoppingCart } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/hooks/customer/useCart";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const { data: cart } = useCart();

  const distinctCount = isAuthenticated ? (cart?.items.length ?? 0) : 0;

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/menu", label: "Menu", icon: Utensils },
    { href: "/my-orders", label: "Orders", icon: ClipboardList },
    { href: "/cart", label: "Cart", icon: ShoppingCart },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 flex justify-around items-center px-2 pb-safe pt-2 bg-background border-t border-border shadow-lg rounded-t-xl">
      {links.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`relative flex flex-col items-center justify-center transition-all active:scale-90 duration-200 rounded-xl px-4 py-2 ${
              isActive ? "text-[#ea580c]" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px] uppercase font-bold tracking-wider mt-1">{link.label}</span>
            
            {/* Cart Badge */}
            {link.href === "/cart" && distinctCount > 0 && (
              <span className="absolute right-3 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ea580c] text-[9px] font-bold text-white shadow-sm">
                {distinctCount > 9 ? "9+" : distinctCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
