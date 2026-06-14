"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth-context";
import { useCart, useUpsertCartItem, useRemoveCartItem, useCheckout } from "@/hooks/customer/useCart";
import { useAddress, useSaveAddress } from "@/hooks/customer/useAddress";
import { toast } from "sonner";
import { ShoppingCart, Minus, Plus, Trash2, MapPin, Loader2, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuth();
  const { data: cart, isLoading } = useCart();
  const { data: address, isLoading: addressLoading } = useAddress();
  const upsert = useUpsertCartItem();
  const remove = useRemoveCartItem();
  const checkout = useCheckout();
  const saveAddress = useSaveAddress();

  const [showConfirm, setShowConfirm] = useState(false);
  const [showAddressSheet, setShowAddressSheet] = useState(false);
  const [notes, setNotes] = useState("");

  // Address form state
  const [addrForm, setAddrForm] = useState({
    name: "", phone: "", address: "", pincode: "", landmark: "",
  });

  const handlePlaceOrder = () => {
    if (!address) {
      // Pre-fill name/phone from context if available
      setShowAddressSheet(true);
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmOrder = async () => {
    try {
      await checkout.mutateAsync(notes || undefined);
      setShowConfirm(false);
      toast.success("Order placed! We'll start preparing your food.");
      router.push("/my-orders");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to place order");
    }
  };

  const handleSaveAddressAndOrder = async () => {
    if (!addrForm.name || !addrForm.phone || !addrForm.address || !addrForm.pincode) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      await saveAddress.mutateAsync({
        name: addrForm.name,
        phone: addrForm.phone,
        address: addrForm.address,
        pincode: addrForm.pincode,
        landmark: addrForm.landmark || undefined,
      });
      setShowAddressSheet(false);
      setShowConfirm(true);
    } catch {
      toast.error("Failed to save address");
    }
  };

  // ── Not logged in
  if (isHydrated && !isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 pb-20 pt-24">
          <ShoppingCart className="h-16 w-16 text-muted-foreground/30" />
          <h1 className="font-heading text-2xl font-bold">Your cart is empty</h1>
          <p className="text-center text-muted-foreground">Sign in to view your cart and place orders.</p>
          <Link href="/menu"><Button size="lg" className="mt-2 rounded-xl">Browse Menu</Button></Link>
        </main>
        <Footer />
        <MobileBottomNav />
      </div>
    );
  }

  const items = cart?.items ?? [];
  const total = cart?.total ?? "0";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-32 pt-24 sm:px-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <button onClick={() => router.back()} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-heading text-2xl font-bold">Your Cart</h1>
          {items.length > 0 && (
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary">
              {items.length} {items.length === 1 ? "item" : "items"}
            </span>
          )}
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
        ) : items.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-border/50 bg-accent/20 py-20">
            <ShoppingCart className="h-12 w-12 text-muted-foreground/30" />
            <p className="text-lg font-medium text-foreground">Your cart is empty</p>
            <p className="text-sm text-muted-foreground">Add some dishes to get started</p>
            <Link href="/menu">
              <Button className="mt-1 rounded-xl">Browse Menu</Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {/* Cart Items */}
            {items.map((item) => (
              <div
                key={item.menuItemId}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm"
              >
                {/* Image */}
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground/30">
                      <span className="material-symbols-outlined text-2xl">restaurant</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col gap-1">
                  <p className="font-semibold leading-tight text-foreground">{item.name}</p>
                  <p className="text-sm font-bold text-[#ea580c]">
                    ₹{parseFloat(item.price).toFixed(0)} × {item.quantity}
                    <span className="ml-2 font-medium text-muted-foreground">
                      = ₹{(parseFloat(item.price) * item.quantity).toFixed(0)}
                    </span>
                  </p>
                </div>

                {/* Qty stepper + remove */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center overflow-hidden rounded-lg border border-[#ea580c]">
                    <button
                      onClick={() => upsert.mutate({ menuItemId: item.menuItemId, quantity: item.quantity - 1 })}
                      disabled={upsert.isPending}
                      className="flex h-8 w-8 items-center justify-center bg-[#ea580c]/10 text-[#ea580c] hover:bg-[#ea580c]/20 active:scale-95"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="min-w-[28px] text-center text-sm font-bold text-[#ea580c]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => upsert.mutate({ menuItemId: item.menuItemId, quantity: item.quantity + 1 })}
                      disabled={upsert.isPending}
                      className="flex h-8 w-8 items-center justify-center bg-[#ea580c] text-white hover:bg-[#c2410c] active:scale-95"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => remove.mutate(item.menuItemId)}
                    disabled={remove.isPending}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Delivery address preview */}
            {address && (
              <div className="mt-2 flex items-start gap-3 rounded-2xl border border-border bg-accent/30 p-4">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div className="flex-1 text-sm">
                  <p className="font-semibold text-foreground">Delivering to</p>
                  <p className="text-muted-foreground">
                    {address.address}{address.landmark ? `, ${address.landmark}` : ""}, {address.pincode}
                  </p>
                </div>
                <Link href="/my-address" className="text-xs font-semibold text-primary hover:underline">
                  Change
                </Link>
              </div>
            )}

            {/* Notes */}
            <div className="mt-1">
              <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                Special instructions (optional)
              </label>
              <Textarea
                id="cart-notes"
                placeholder="E.g. no onions, extra spicy..."
                className="resize-none rounded-xl border-border text-sm"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Order summary */}
            <div className="mt-2 rounded-2xl border border-border bg-card p-4">
              <Separator className="my-3" />
              <div className="flex items-center justify-between">
                <span className="font-heading text-lg font-bold text-foreground">Total</span>
                <span className="font-heading text-xl font-bold text-[#ea580c]">₹{parseFloat(total).toFixed(0)}</span>
              </div>
            </div>

            {/* Place order */}
            <Button
              id="cart-place-order"
              size="lg"
              onClick={handlePlaceOrder}
              disabled={checkout.isPending || items.length === 0}
              className="mt-2 h-14 w-full rounded-2xl text-lg font-bold shadow-md transition-transform active:scale-[0.98]"
            >
              {checkout.isPending ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Placing Order...</>
              ) : (
                "Place Order"
              )}
            </Button>
          </div>
        )}
      </main>

      <Footer />
      <MobileBottomNav />

      {/* Confirm order dialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="max-w-sm rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold">Confirm your order?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              {address && (
                <span className="block mt-1 text-foreground/80">
                  📍 {address.address}, {address.pincode}
                </span>
              )}
              <span className="mt-1 block font-semibold text-[#ea580c]">
                Total: ₹{parseFloat(total).toFixed(0)}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
            <AlertDialogAction
              id="confirm-order-btn"
              onClick={handleConfirmOrder}
              disabled={checkout.isPending}
              className="h-11 w-full rounded-xl font-semibold"
            >
              {checkout.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Yes, place order"}
            </AlertDialogAction>
            <AlertDialogCancel className="h-11 w-full rounded-xl">Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Address sheet (shown when no address saved) */}
      <Sheet open={showAddressSheet} onOpenChange={setShowAddressSheet}>
        <SheetContent side="bottom" className="rounded-t-3xl px-6 pb-8">
          <SheetHeader className="mb-4 text-left">
            <SheetTitle className="font-heading text-xl font-bold">Add delivery address</SheetTitle>
            <SheetDescription>
              We need your address to deliver your order.
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Name *</label>
                <Input
                  id="addr-name"
                  placeholder="Recipient name"
                  value={addrForm.name}
                  onChange={(e) => setAddrForm((p) => ({ ...p, name: e.target.value }))}
                  className="rounded-xl"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Phone *</label>
                <Input
                  id="addr-phone"
                  placeholder="Phone number"
                  type="tel"
                  value={addrForm.phone}
                  onChange={(e) => setAddrForm((p) => ({ ...p, phone: e.target.value }))}
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Address *</label>
              <Textarea
                id="addr-address"
                placeholder="Flat/House No., Street, Area"
                value={addrForm.address}
                onChange={(e) => setAddrForm((p) => ({ ...p, address: e.target.value }))}
                className="resize-none rounded-xl"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Pincode *</label>
                <Input
                  id="addr-pincode"
                  placeholder="110001"
                  maxLength={6}
                  value={addrForm.pincode}
                  onChange={(e) => setAddrForm((p) => ({ ...p, pincode: e.target.value }))}
                  className="rounded-xl"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Landmark</label>
                <Input
                  id="addr-landmark"
                  placeholder="Near... (optional)"
                  value={addrForm.landmark}
                  onChange={(e) => setAddrForm((p) => ({ ...p, landmark: e.target.value }))}
                  className="rounded-xl"
                />
              </div>
            </div>
            <Button
              id="addr-save-order"
              onClick={handleSaveAddressAndOrder}
              disabled={saveAddress.isPending}
              className="mt-2 h-12 w-full rounded-xl font-semibold"
            >
              {saveAddress.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save & Continue"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
