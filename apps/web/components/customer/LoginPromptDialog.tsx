"use client";

import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { ShoppingBag } from "lucide-react";

interface LoginPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginPromptDialog({ open, onOpenChange }: LoginPromptDialogProps) {
  const router = useRouter();

  const handleSignIn = () => {
    onOpenChange(false);
    router.push("/login");
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm rounded-2xl">
        <AlertDialogHeader>
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <ShoppingBag className="h-6 w-6 text-primary" />
          </div>
          <AlertDialogTitle className="text-center text-lg font-bold">
            Sign in to add items
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Create a free account or sign in to save your cart and place orders.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
          <AlertDialogAction
            id="login-prompt-signin"
            onClick={handleSignIn}
            className="h-11 w-full rounded-xl font-semibold"
          >
            Sign in
          </AlertDialogAction>
          <AlertDialogCancel
            id="login-prompt-cancel"
            className="h-11 w-full rounded-xl"
          >
            Maybe later
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
