"use client";

import { useOrders, useUpdateOrderStatus } from "@/hooks/admin/useOrders";
import { Order, ORDER_STATUS } from "@repo/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersPage() {
  const { data, isLoading } = useOrders();
  const updateStatus = useUpdateOrderStatus();

  const handleAdvance = (id: string, currentStatus: string) => {
    let nextStatus = "";
    if (currentStatus === ORDER_STATUS.PENDING || currentStatus === ORDER_STATUS.CONFIRMED) nextStatus = ORDER_STATUS.PREPARING; // pending/confirmed -> preparing
    else if (currentStatus === ORDER_STATUS.PREPARING) nextStatus = ORDER_STATUS.OUT_FOR_DELIVERY; // preparing -> out_for_delivery
    else if (currentStatus === ORDER_STATUS.OUT_FOR_DELIVERY) nextStatus = ORDER_STATUS.DELIVERED; // out_for_delivery -> delivered
    
    if (nextStatus) {
      updateStatus.mutate({ id, status: nextStatus }, {
        onSuccess: () => toast.success(`Order advanced to ${nextStatus}`),
        onError: () => toast.error(`Failed to advance order`)
      });
    }
  };

  if (isLoading) {
    return <div className="p-8"><Skeleton className="h-[600px] w-full" /></div>;
  }

  // Group orders by status
  const orders = data?.data || [];
  const pending = orders.filter((o: Order) => o.status === ORDER_STATUS.PENDING || o.status === ORDER_STATUS.CONFIRMED);
  const preparing = orders.filter((o: Order) => o.status === ORDER_STATUS.PREPARING);
  const ready = orders.filter((o: Order) => o.status === ORDER_STATUS.OUT_FOR_DELIVERY);

  interface ColumnProps {
    title: string;
    count: number;
    items: Order[];
    colorClass: string;
  }

  const Column = ({ title, count, items, colorClass }: ColumnProps) => (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <div className={`flex items-center justify-between p-4 rounded-t-xl border-b-4 ${colorClass} bg-card border border-b-0`}>
        <h2 className="font-heading text-xl font-bold">{title}</h2>
        <Badge variant="secondary" className="font-bold">{count}</Badge>
      </div>
      <ScrollArea className="flex-1 bg-muted/30 p-4 border border-t-0 rounded-b-xl">
        <div className="flex flex-col gap-4">
          {items.map((order: Order) => (
            <Card key={order.id} className="border-border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-center mb-1">
                  <CardTitle className="text-lg">Order #{order.id.toString().slice(-4)}</CardTitle>
                  <span className="text-xs text-muted-foreground">Just now</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{order.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                  <span>{order.totalAmount ? `$${Number(order.totalAmount).toFixed(2)}` : 'N/A'}</span>
                </div>
                <Separator className="mb-3" />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">Details</Button>
                  {order.status !== ORDER_STATUS.DELIVERED && order.status !== ORDER_STATUS.CANCELLED && (
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleAdvance(order.id, order.status)}
                      disabled={updateStatus.isPending}
                    >
                      Advance
                    </Button>
                  )}
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight font-heading">Orders Board</h2>
          <p className="text-muted-foreground">Manage active orders across all stations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Column title="Incoming" count={pending.length} items={pending} colorClass="border-blue-500" />
        <Column title="Preparing" count={preparing.length} items={preparing} colorClass="border-orange-500" />
        <Column title="Ready" count={ready.length} items={ready} colorClass="border-green-500" />
      </div>
    </div>
  );
}
