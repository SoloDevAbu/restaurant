import Link from "next/link";
import { LocationEdit } from "lucide-react";

interface NavbarProps {
  variant?: "user" | "admin" | "delivery";
}

export function Navbar({ variant = "user" }: NavbarProps) {
  return (
    <nav className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-border bg-background/80 px-4 py-3 shadow-sm backdrop-blur-md">
      <Link href="/" className="flex items-center gap-3">
        {/* Orange A square */}
        <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[10px] bg-[#ea580c] shadow-sm">
          <span className="font-heading text-2xl leading-none font-bold text-white">
            M
          </span>
        </div>

        {/* Texts */}
        <div className="flex flex-col justify-center">
          <span className="mb-1 font-heading text-[22px] leading-none font-black tracking-wider text-foreground">
            Modern Heart
          </span>
          <span className="flex items-center gap-[2px] text-[13px] leading-none text-muted-foreground">
            <span className="material-symbols-outlined text-[14px]">
              <LocationEdit />
            </span>
            Fine Dining Restaurant
          </span>
        </div>
      </Link>

      {/* Removed menu, orders, cart, and right side items for now as requested */}
      <div className="hidden"></div>
    </nav>
  );
}
