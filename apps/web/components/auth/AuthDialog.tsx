"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useRequestOtp, useVerifyOtp } from "@/hooks/customer/useAuth";
import { Phone, ArrowLeft, Loader2 } from "lucide-react";

type Step = "phone" | "otp" | "name";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AuthDialog({ open, onOpenChange, onSuccess }: AuthDialogProps) {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const requestOtp = useRequestOtp();
  const verifyOtp = useVerifyOtp();

  // ── reset when dialog closes
  const handleOpenChange = (val: boolean) => {
    if (!val) {
      setStep("phone");
      setPhone("");
      setOtp("");
      setName("");
      setError("");
    }
    onOpenChange(val);
  };

  // ── Step 1: Send OTP
  const handleSendOtp = async () => {
    if (phone.trim().length < 7) {
      setError("Enter a valid phone number");
      return;
    }
    setError("");
    try {
      await requestOtp.mutateAsync(phone.trim());
      setStep("otp");
      startResendCooldown();
    } catch {
      setError("Failed to send OTP. Please try again.");
    }
  };

  const startResendCooldown = () => {
    setResendCooldown(30);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // ── Step 2 → 3: Verify OTP (if new user ask for name, else done)
  const handleVerifyOtp = async (nameOverride?: string) => {
    if (otp.length < 6) {
      setError("Enter the 6-digit OTP");
      return;
    }
    setError("");
    try {
      const result = await verifyOtp.mutateAsync({
        phone: phone.trim(),
        otp,
        name: nameOverride?.trim() || undefined,
      });
      if (result.isNewUser && !nameOverride) {
        // Move to name step
        setStep("name");
      } else {
        // Logged in ✓
        handleOpenChange(false);
        onSuccess?.();
      }
    } catch (err: any) {
      setError(err?.response?.data?.error ?? "Invalid OTP. Please try again.");
    }
  };

  // ── Step 3: Submit name for new users
  const handleSubmitName = async () => {
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    await handleVerifyOtp(name.trim());
  };

  const isLoading = requestOtp.isPending || verifyOtp.isPending;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full max-w-sm rounded-2xl p-6">
        {/* ── Phone step ── */}
        {step === "phone" && (
          <div className="flex flex-col gap-5">
            <DialogHeader>
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <DialogTitle className="text-center text-xl font-bold">
                Sign in
              </DialogTitle>
              <DialogDescription className="text-center">
                Enter your phone number to continue
              </DialogDescription>
            </DialogHeader>

            <div className="flex overflow-hidden rounded-xl border border-border bg-background focus-within:ring-2 focus-within:ring-primary/30">
              <span className="flex items-center border-r border-border bg-muted px-3 text-sm font-medium text-muted-foreground">
                +91
              </span>
              <Input
                id="auth-phone"
                type="tel"
                placeholder="Enter phone number"
                className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                maxLength={10}
                autoFocus
              />
            </div>

            {error && <p className="text-center text-sm text-destructive">{error}</p>}

            <Button
              id="auth-send-otp"
              onClick={handleSendOtp}
              disabled={isLoading || phone.length < 7}
              className="h-12 w-full rounded-xl text-base font-semibold"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Continue"}
            </Button>
          </div>
        )}

        {/* ── OTP step ── */}
        {step === "otp" && (
          <div className="flex flex-col gap-5">
            <DialogHeader>
              <button
                className="absolute left-4 top-4 text-muted-foreground hover:text-foreground"
                onClick={() => { setStep("phone"); setOtp(""); setError(""); }}
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <DialogTitle className="text-center text-xl font-bold">
                Enter OTP
              </DialogTitle>
              <DialogDescription className="text-center">
                We sent a 6-digit code to <span className="font-medium text-foreground">+91 {phone}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="flex justify-center">
              <InputOTP
                id="auth-otp-input"
                maxLength={6}
                value={otp}
                onChange={(val) => {
                  setOtp(val);
                  setError("");
                  if (val.length === 6) {
                    // Auto-submit when all 6 digits entered
                    setTimeout(() => handleVerifyOtp(), 100);
                  }
                }}
              >
                <InputOTPGroup className="gap-2">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className="h-12 w-10 rounded-xl border-border text-lg font-bold"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            {error && <p className="text-center text-sm text-destructive">{error}</p>}

            <Button
              id="auth-verify-otp"
              onClick={() => handleVerifyOtp()}
              disabled={isLoading || otp.length < 6}
              className="h-12 w-full rounded-xl text-base font-semibold"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify & Continue"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {resendCooldown > 0 ? (
                <>Resend OTP in <span className="font-medium text-foreground">{resendCooldown}s</span></>
              ) : (
                <button
                  className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
                  onClick={() => { setOtp(""); setError(""); handleSendOtp(); }}
                >
                  Resend OTP
                </button>
              )}
            </p>
          </div>
        )}

        {/* ── Name step (new users only) ── */}
        {step === "name" && (
          <div className="flex flex-col gap-5">
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-bold">
                What's your name?
              </DialogTitle>
              <DialogDescription className="text-center">
                Just this once — we'll remember you next time.
              </DialogDescription>
            </DialogHeader>

            <Input
              id="auth-name"
              type="text"
              placeholder="Your full name"
              className="h-12 rounded-xl border-border text-base"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmitName()}
              autoFocus
            />

            {error && <p className="text-center text-sm text-destructive">{error}</p>}

            <Button
              id="auth-submit-name"
              onClick={handleSubmitName}
              disabled={isLoading || !name.trim()}
              className="h-12 w-full rounded-xl text-base font-semibold"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Let's go →"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
