"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { useUserOrders } from "@/hooks/customer/useUserOrders";
import { ClipboardList, ChevronRight } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  pending:          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  confirmed:        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  preparing:        "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  out_for_delivery: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  delivered:        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  cancelled:        "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const STATUS_LABELS: Record<string, string> = {
  pending:          "Pending",
  confirmed:        "Confirmed",
  preparing:        "Preparing",
  out_for_delivery: "Out for delivery",
  delivered:        "Delivered",
  cancelled:        "Cancelled",
};

export default function MyOrdersPage() {
  const { isAuthenticated, isHydrated } = useAuth();
  const { data: orders, isLoading } = useUserOrders();

  if (isHydrated && !isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 pb-20 pt-24">
          <ClipboardList className="h-16 w-16 text-muted-foreground/30" />
          <h1 className="font-heading text-2xl font-bold">No orders yet</h1>
          <p className="text-center text-muted-foreground">Sign in to see your order history.</p>
          <Link href="/menu"><Button size="lg" className="mt-2 rounded-xl">Browse Menu</Button></Link>
        </main>
        <Footer />
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-32 pt-24 sm:px-6">
        <h1 className="mb-6 font-heading text-2xl font-bold">My Orders</h1>

        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-28 w-full rounded-2xl" />)}
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-border/50 bg-accent/20 py-20">
            <ClipboardList className="h-12 w-12 text-muted-foreground/30" />
            <p className="text-lg font-medium">No orders yet</p>
            <p className="text-sm text-muted-foreground">Your order history will appear here.</p>
            <Link href="/menu"><Button className="mt-1 rounded-xl">Order Now</Button></Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-mono text-muted-foreground">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLORS[order.status] ?? ""}`}>
                    {STATUS_LABELS[order.status] ?? order.status}
                  </span>
                </div>

                {/* Items summary */}
                <div className="text-sm text-muted-foreground">
                  {order.items.slice(0, 2).map((item) => (
                    <span key={item.id} className="block">
                      {item.quantity}× {item.itemName}
                    </span>
                  ))}
                  {order.items.length > 2 && (
                    <span className="text-xs">+{order.items.length - 2} more</span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <span className="font-bold text-foreground">
                    ₹{parseFloat(order.totalAmount).toFixed(0)}
                  </span>
                  {order.estimatedMinutes && order.status !== "delivered" && (
                    <span className="text-xs text-muted-foreground">
                      ~{order.estimatedMinutes} min
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
