"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth-context";
import { useLogout } from "@/hooks/customer/useAuth";
import { ClipboardList, MapPin, LogOut } from "lucide-react";

/** Avatar + dropdown: Orders, Address, Sign out */
export function UserMenu() {
  const { user } = useAuth();
  const logout = useLogout();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          id="user-menu-trigger"
          className="flex items-center rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Avatar className="h-9 w-9 cursor-pointer border-2 border-primary/20 transition-opacity hover:opacity-80">
            <AvatarFallback className="bg-primary/10 text-sm font-bold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52 rounded-xl border-border shadow-lg">
        <DropdownMenuLabel className="pb-1">
          <p className="font-semibold">{user?.name}</p>
          <p className="text-xs font-normal text-muted-foreground">+91 {user?.phone}</p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/my-orders" id="user-menu-orders" className="flex cursor-pointer items-center gap-2">
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
            My Orders
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/my-address" id="user-menu-address" className="flex cursor-pointer items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            My Address
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          id="user-menu-signout"
          onClick={() => logout.mutate()}
          className="flex cursor-pointer items-center gap-2 text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
