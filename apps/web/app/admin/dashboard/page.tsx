import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function AdminDashboardPage() {
  const orders = {
    incoming: [
      { id: "AH-8493", time: "2 min ago", items: 3, total: "$64.50", status: "New" },
      { id: "AH-8494", time: "5 min ago", items: 1, total: "$22.00", status: "New" },
    ],
    preparing: [
      { id: "AH-8490", time: "12 min ago", items: 4, total: "$112.00", status: "Cooking" },
      { id: "AH-8491", time: "18 min ago", items: 2, total: "$46.00", status: "Plating" },
    ],
    ready: [
      { id: "AH-8488", time: "25 min ago", items: 2, total: "$58.00", status: "Awaiting Pickup" },
    ]
  };

  const Column = ({ title, count, items, colorClass }: any) => (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <div className={`flex items-center justify-between p-4 rounded-t-xl border-b-4 ${colorClass} bg-card border border-b-0`}>
        <h2 className="font-heading text-xl font-bold">{title}</h2>
        <Badge variant="secondary" className="font-bold">{count}</Badge>
      </div>
      <ScrollArea className="flex-1 bg-muted/30 p-4 border border-t-0 rounded-b-xl">
        <div className="flex flex-col gap-4">
          {items.map((order: any, idx: number) => (
            <Card key={idx} className="border-border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-center mb-1">
                  <CardTitle className="text-lg">{order.id}</CardTitle>
                  <span className="text-xs text-muted-foreground">{order.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{order.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                  <span>{order.items} items</span>
                  <span>{order.total}</span>
                </div>
                <Separator className="mb-3" />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">Details</Button>
                  <Button size="sm" className="flex-1">Advance</Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {items.length === 0 && (
            <div className="h-32 flex items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-xl">
              No orders
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar variant="admin" />
      
      <main className="flex-1 pt-24 pb-8 max-w-[1600px] mx-auto w-full px-4 md:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Orders Board</h1>
            <p className="text-muted-foreground mt-1">Manage active orders across all stations</p>
          </div>
          <Button variant="outline" className="gap-2">
            <span className="material-symbols-outlined text-[20px]">refresh</span>
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Column title="Incoming" count={orders.incoming.length} items={orders.incoming} colorClass="border-blue-500" />
          <Column title="Preparing" count={orders.preparing.length} items={orders.preparing} colorClass="border-orange-500" />
          <Column title="Ready for Delivery" count={orders.ready.length} items={orders.ready} colorClass="border-green-500" />
        </div>
      </main>
    </div>
  );
}
