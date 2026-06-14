"use client";

import { AxiosError } from "axios";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useLogin } from "@/hooks/admin/useAuth";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const login = useLogin();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ email, password }, {
      onSuccess: () => {
        toast.success("Login successful");
        router.push("/admin/dashboard");
      },
      onError: (error: Error) => {
        const axiosError = error as AxiosError<{ error?: string; message?: string }>;
        toast.error(axiosError.response?.data?.error || axiosError.response?.data?.message || "Login failed");
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 items-center justify-center p-4">
      <div className="absolute top-8 left-8">
        <Link href="/" className="font-heading text-2xl font-bold text-primary">
          Modern Hearth
        </Link>
      </div>

      <Card className="w-full max-w-md border-border shadow-lg">
        <CardHeader className="space-y-2 text-center pb-8">
          <CardTitle className="font-heading text-3xl font-bold">Admin Portal</CardTitle>
          <CardDescription className="text-base">Sign in to manage orders and menu</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 text-left">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@modernhearth.com" 
                required 
                className="h-12" 
                disabled={login.isPending}
              />
            </div>
            <div className="space-y-2 text-left">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-sm text-primary hover:underline">Forgot password?</Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="h-12" 
                disabled={login.isPending}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-bold mt-6"
              disabled={login.isPending}
            >
              {login.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center pt-2 pb-8">
          <p className="text-sm text-muted-foreground">Authorized personnel only.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
