"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import { useAddress, useSaveAddress } from "@/hooks/customer/useAddress";
import { toast } from "sonner";
import { MapPin, Loader2, ArrowLeft } from "lucide-react";

export default function MyAddressPage() {
  const router = useRouter();
  const { isAuthenticated, isHydrated, user } = useAuth();
  const { data: address, isLoading } = useAddress();
  const save = useSaveAddress();

  const [form, setForm] = useState({
    name: "", phone: "", address: "", pincode: "", landmark: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-fill from saved address or user name/phone
  useEffect(() => {
    if (address) {
      setForm({
        name: address.name,
        phone: address.phone,
        address: address.address,
        pincode: address.pincode,
        landmark: address.landmark ?? "",
      });
    } else if (user) {
      setForm((p) => ({ ...p, name: user.name, phone: user.phone }));
    }
  }, [address, user]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.phone.trim()) errs.phone = "Phone is required";
    if (!form.address.trim()) errs.address = "Address is required";
    if (!form.pincode.trim()) errs.pincode = "Pincode is required";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    try {
      await save.mutateAsync({
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        pincode: form.pincode.trim(),
        landmark: form.landmark.trim() || undefined,
      });
      toast.success("Address saved!");
    } catch {
      toast.error("Failed to save address. Please try again.");
    }
  };

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value })),
  });

  if (isHydrated && !isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 pb-20 pt-24">
          <MapPin className="h-16 w-16 text-muted-foreground/30" />
          <h1 className="font-heading text-2xl font-bold">Sign in first</h1>
          <p className="text-center text-muted-foreground">Please sign in to manage your delivery address.</p>
        </main>
        <Footer />
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="mx-auto w-full max-w-xl flex-1 px-4 pb-32 pt-24 sm:px-6">
        <div className="mb-6 flex items-center gap-3">
          <button onClick={() => router.back()} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="font-heading text-2xl font-bold">Delivery Address</h1>
            <p className="text-sm text-muted-foreground">
              {address ? "Update your saved address" : "Save your delivery address"}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="af-name" className="text-sm font-medium">
                Recipient Name <span className="text-destructive">*</span>
              </label>
              <Input id="af-name" placeholder="Full name" className="h-12 rounded-xl" {...field("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="af-phone" className="text-sm font-medium">
                Phone <span className="text-destructive">*</span>
              </label>
              <div className="flex overflow-hidden rounded-xl border border-border focus-within:ring-2 focus-within:ring-primary/30">
                <span className="flex items-center border-r border-border bg-muted px-3 text-sm text-muted-foreground">
                  +91
                </span>
                <Input
                  id="af-phone"
                  type="tel"
                  placeholder="Phone number"
                  className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
                  {...field("phone")}
                />
              </div>
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="af-address" className="text-sm font-medium">
                Address <span className="text-destructive">*</span>
              </label>
              <Textarea
                id="af-address"
                placeholder="Flat/House No., Building, Street, Area"
                className="resize-none rounded-xl"
                rows={3}
                {...field("address")}
              />
              {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
            </div>

            {/* Pincode + Landmark */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="af-pincode" className="text-sm font-medium">
                  Pincode <span className="text-destructive">*</span>
                </label>
                <Input id="af-pincode" placeholder="110001" maxLength={6} className="h-12 rounded-xl" {...field("pincode")} />
                {errors.pincode && <p className="text-xs text-destructive">{errors.pincode}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="af-landmark" className="text-sm font-medium text-muted-foreground">
                  Landmark
                </label>
                <Input id="af-landmark" placeholder="Near... (optional)" className="h-12 rounded-xl" {...field("landmark")} />
              </div>
            </div>

            <Button
              id="af-save"
              type="submit"
              disabled={save.isPending}
              size="lg"
              className="mt-2 h-12 w-full rounded-xl font-semibold"
            >
              {save.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
              ) : (
                address ? "Update Address" : "Save Address"
              )}
            </Button>
          </form>
        )}
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
