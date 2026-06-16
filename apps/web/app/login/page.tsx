"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/hooks/customer/useAuth";
import { Loader2, Phone } from "lucide-react";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const login = useLogin();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (phone.length < 7) {
      setError("Please enter a valid phone number");
      return;
    }

    try {
      await login.mutateAsync({ phone: phone.trim() });
      router.back();
    } catch (err: any) {
      setError(err?.response?.data?.error ?? "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-card p-8 shadow-xl border border-border">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
            Welcome back
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Login with your phone number
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="phone" className="sr-only">
                Phone Number
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Phone Number"
                  className="pl-10 h-12 rounded-xl"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  maxLength={15}
                />
              </div>
            </div>
          </div>

          {error && <p className="text-center text-sm text-destructive font-medium">{error}</p>}

          <Button
            type="submit"
            disabled={login.isPending}
            className="w-full h-12 rounded-xl text-base font-semibold"
          >
            {login.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Login"}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground mt-4">
          Don't have an account?{" "}
          <Link href="/signup" className="font-semibold text-primary hover:underline">
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
}
