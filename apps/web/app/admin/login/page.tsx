import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function AdminLoginPage() {
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
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="admin@modernhearth.com" required className="h-12" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-sm text-primary hover:underline">Forgot password?</Link>
              </div>
              <Input id="password" type="password" required className="h-12" />
            </div>
            <Link href="/admin/dashboard" className="block mt-6">
              <Button type="button" className="w-full h-12 text-lg font-bold">Sign In</Button>
            </Link>
          </form>
        </CardContent>
        <CardFooter className="justify-center pt-2 pb-8">
          <p className="text-sm text-muted-foreground">Authorized personnel only.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
