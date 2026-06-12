import Link from "next/link";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  variant?: "user" | "admin" | "delivery";
}

export function Navbar({ variant = "user" }: NavbarProps) {
  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-4 py-2 bg-background/80 backdrop-blur-md shadow-sm border-b border-border">
      <Link href="/" className="font-heading text-2xl md:text-3xl font-bold text-primary">
        Modern Hearth
      </Link>
      
      {/* Desktop Nav Links */}
      {variant === "user" && (
        <div className="hidden md:flex items-center gap-8">
          <Link href="/menu" className="text-primary font-bold border-b-2 border-primary transition-colors">
            Menu
          </Link>
          <Link href="/orders/tracking" className="text-secondary hover:text-primary transition-colors">
            Orders
          </Link>
          <Link href="/cart" className="text-secondary hover:text-primary transition-colors">
            Cart
          </Link>
        </div>
      )}

      {variant === "admin" && (
        <div className="hidden md:flex items-center gap-8">
          <Link href="/admin/dashboard" className="text-primary font-bold border-b-2 border-primary transition-colors">
            Dashboard
          </Link>
          <Link href="/admin/menu" className="text-secondary hover:text-primary transition-colors">
            Menu Management
          </Link>
        </div>
      )}

      {variant === "delivery" && (
        <div className="hidden md:flex items-center gap-8">
          <Link href="/delivery/dashboard" className="text-primary font-bold border-b-2 border-primary transition-colors">
            My Deliveries
          </Link>
        </div>
      )}

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-primary hover:text-primary/80">
          <span className="material-symbols-outlined text-[28px]">account_circle</span>
        </Button>
      </div>
    </nav>
  );
}
