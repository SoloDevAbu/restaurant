import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function DeliveryLoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/30 items-center justify-center p-4">
      <div className="absolute top-8 left-8">
        <Link href="/" className="font-heading text-2xl font-bold text-primary">
          Modern Hearth
        </Link>
      </div>

      <Card className="w-full max-w-md border-border shadow-lg">
        <CardHeader className="space-y-2 text-center pb-8">
          <CardTitle className="font-heading text-3xl font-bold">Driver Login</CardTitle>
          <CardDescription className="text-base">Sign in to view your assigned deliveries</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="(555) 000-0000" required className="h-12" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="pin">Driver PIN</Label>
              </div>
              <Input id="pin" type="password" required className="h-12" placeholder="••••" maxLength={4} />
            </div>
            <Link href="/delivery/dashboard" className="block mt-6">
              <Button type="button" className="w-full h-12 text-lg font-bold">Login</Button>
            </Link>
          </form>
        </CardContent>
        <CardFooter className="justify-center pt-2 pb-8">
          <p className="text-sm text-muted-foreground">Having trouble? Contact dispatch.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
