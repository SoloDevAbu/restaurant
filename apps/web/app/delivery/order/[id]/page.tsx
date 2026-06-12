"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function DeliveryOrderDetailsPage() {
  const params = useParams();
  const id = params.id as string || "AH-8488";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar variant="delivery" />
      
      <main className="flex-1 pt-24 pb-24 max-w-2xl mx-auto w-full px-4">
        <Link href="/delivery/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
          <span className="material-symbols-outlined text-[18px] mr-1">arrow_back</span>
          Back to Dashboard
        </Link>

        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Order {id}</h1>
            <p className="text-muted-foreground mt-1">Ready for Pickup at Restaurant</p>
          </div>
          <Badge className="text-lg py-1 px-3">
            $4.99
          </Badge>
        </div>

        {/* Map Placeholder */}
        <div className="w-full h-48 bg-muted rounded-xl mb-6 flex flex-col items-center justify-center border border-border">
          <span className="material-symbols-outlined text-4xl text-muted-foreground mb-2">map</span>
          <p className="text-muted-foreground font-medium">Map View Unavailable</p>
        </div>

        <Card className="border-border shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Drop-off Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary">location_on</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground">123 Main St, Apt 4B</h3>
                <p className="text-muted-foreground mb-2">Customer: John D.</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <span className="material-symbols-outlined text-[16px]">call</span>
                    Call
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <span className="material-symbols-outlined text-[16px]">chat</span>
                    Message
                  </Button>
                </div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Delivery Instructions</h4>
              <p className="text-foreground">"Please leave at the door and ring the doorbell. Gate code is 4321."</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-lg">Order Contents</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-3">
              <li className="flex gap-3 text-sm">
                <span className="font-semibold w-6">1x</span>
                <span className="text-foreground flex-1">Hearth-Smoked Ribeye</span>
              </li>
              <li className="flex gap-3 text-sm">
                <span className="font-semibold w-6">2x</span>
                <span className="text-foreground flex-1">Heirloom Tomato Bruschetta</span>
              </li>
              <li className="flex gap-3 text-sm">
                <span className="font-semibold w-6">1x</span>
                <span className="text-foreground flex-1">Chocolate Lava Cake</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Floating Action Button for Delivery */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-sm border-t border-border flex justify-center z-40">
          <div className="max-w-2xl w-full">
            <Button className="w-full h-14 text-lg font-bold shadow-md transition-transform active:scale-95">
              Confirm Pickup
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
