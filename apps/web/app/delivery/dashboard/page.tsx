import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function DeliveryDashboardPage() {
  const activeDeliveries = [
    { id: "AH-8488", address: "123 Main St, Apt 4B", distance: "1.2 miles", time: "10 mins", status: "Ready for Pickup", fee: "$4.99" },
    { id: "AH-8485", address: "456 Oak Ave", distance: "2.5 miles", time: "18 mins", status: "Picked Up", fee: "$6.50" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar variant="delivery" />
      
      <main className="flex-1 pt-24 pb-12 max-w-3xl mx-auto w-full px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">My Deliveries</h1>
            <p className="text-muted-foreground mt-1">You have 2 active orders</p>
          </div>
          <Badge className="bg-green-600/10 text-green-600 hover:bg-green-600/20 shadow-none text-sm py-1 px-3">
            Online
          </Badge>
        </div>

        <div className="space-y-4">
          {activeDeliveries.map((delivery) => (
            <Card key={delivery.id} className="border-border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center mb-2">
                  <CardTitle className="text-xl font-heading">{delivery.id}</CardTitle>
                  <Badge variant={delivery.status === "Ready for Pickup" ? "default" : "outline"}>
                    {delivery.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3 mb-4">
                  <span className="material-symbols-outlined text-muted-foreground mt-0.5">location_on</span>
                  <div>
                    <p className="font-medium text-foreground">{delivery.address}</p>
                    <p className="text-sm text-muted-foreground mt-1">{delivery.distance} • ~{delivery.time} away</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-border">
                  <div className="font-semibold text-lg">{delivery.fee}</div>
                  <Link href={`/delivery/order/${delivery.id}`}>
                    <Button>View Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {activeDeliveries.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
              <span className="material-symbols-outlined text-4xl text-muted-foreground mb-4">check_circle</span>
              <h3 className="text-lg font-semibold text-foreground">No active deliveries</h3>
              <p className="text-muted-foreground">Waiting for new assignments...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
