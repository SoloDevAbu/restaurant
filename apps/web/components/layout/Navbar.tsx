"use client";

import Link from "next/link";
import { LocationEdit } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { CartButton } from "@/components/customer/CartButton";
import { UserMenu } from "@/components/customer/UserMenu";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  variant?: "user" | "admin" | "delivery";
}

export function Navbar({ variant = "user" }: NavbarProps) {
  const { isAuthenticated, isHydrated } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <nav className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-border bg-background/80 px-4 py-3 shadow-sm backdrop-blur-md">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[10px] bg-[#ea580c] shadow-sm">
            <span className="font-heading text-2xl leading-none font-bold text-white">M</span>
          </div>
          <div className="flex flex-col justify-center">
            <span className="mb-1 font-heading text-[22px] leading-none font-black tracking-wider text-foreground">
              Modern Heart
            </span>
            <span className="flex items-center gap-[2px] text-[13px] leading-none text-muted-foreground">
              <LocationEdit className="h-3.5 w-3.5" />
              Fine Dining Restaurant
            </span>
          </div>
        </Link>

        {/* Right side — only for user variant */}
        {variant === "user" && (
          <div className="flex items-center gap-2">
            <CartButton />

            {/* Show avatar or sign-in button only once localStorage is hydrated
                to avoid hydration mismatch flicker */}
            {isHydrated && (
              isAuthenticated ? (
                <UserMenu />
              ) : (
                <Button
                  id="navbar-signin-btn"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAuth(true)}
                  className="rounded-xl border-primary/30 text-sm font-semibold"
                >
                  Sign in
                </Button>
              )
            )}
          </div>
        )}
      </nav>

      {/* Auth dialog — lazy mounted */}
      <AuthDialog open={showAuth} onOpenChange={setShowAuth} />
    </>
  );
}
