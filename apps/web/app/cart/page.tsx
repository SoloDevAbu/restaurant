import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CartPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar variant="user" />
      
      <main className="flex-1 pt-24 pb-24 md:pb-12 max-w-7xl mx-auto w-full px-4">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-8">Your Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="font-heading text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                {[
                  { name: "Hearth-Smoked Ribeye", qty: 1, price: 45, options: "Medium Rare" },
                  { name: "Heirloom Tomato Bruschetta", qty: 2, price: 12, options: "Extra balsamic" },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center font-semibold text-primary">
                        {item.qty}x
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{item.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{item.options}</p>
                        <div className="flex gap-3 mt-3">
                          <button className="text-sm text-primary font-medium hover:underline">Edit</button>
                          <button className="text-sm text-destructive font-medium hover:underline">Remove</button>
                        </div>
                      </div>
                    </div>
                    <div className="font-semibold text-foreground">
                      ${(item.price * item.qty).toFixed(2)}
                    </div>
                  </div>
                ))}
                
                <Separator className="my-2" />
                
                <div className="flex justify-between text-muted-foreground text-sm">
                  <span>Subtotal</span>
                  <span>$69.00</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-sm">
                  <span>Tax (8.5%)</span>
                  <span>$5.87</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-sm">
                  <span>Delivery Fee</span>
                  <span>$4.99</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center text-lg font-bold text-foreground">
                  <span>Total</span>
                  <span>$79.86</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Form */}
          <div className="lg:col-span-5">
            <Card className="border-border shadow-sm sticky top-24">
              <CardHeader>
                <CardTitle className="font-heading text-xl">Delivery Details</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="123 Main St, Apt 4B" className="bg-background" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="(555) 123-4567" className="bg-background" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="instructions">Delivery Instructions</Label>
                  <Input id="instructions" placeholder="Leave at door" className="bg-background" />
                </div>
              </CardContent>
              <Separator className="my-2" />
              <CardHeader className="pt-4">
                <CardTitle className="font-heading text-xl">Payment</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="card">Card Number</Label>
                  <Input id="card" placeholder="**** **** **** 1234" className="bg-background" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="exp">Expiry</Label>
                    <Input id="exp" placeholder="MM/YY" className="bg-background" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" className="bg-background" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-accent/30 rounded-b-xl border-t border-border pt-6 pb-6">
                <Button className="w-full h-14 text-lg font-bold shadow-md transition-transform active:scale-95">
                  Place Order - $79.86
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
