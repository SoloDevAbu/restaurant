import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function OrderTrackingPage() {
  const steps = [
    { title: "Order Placed", time: "7:30 PM", active: true, completed: true, icon: "receipt" },
    { title: "Preparing", time: "7:35 PM", active: true, completed: true, icon: "skillet" },
    { title: "On the Way", time: "Estimated 8:05 PM", active: true, completed: false, icon: "two_wheeler" },
    { title: "Delivered", time: "Estimated 8:15 PM", active: false, completed: false, icon: "home" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar variant="user" />
      
      <main className="flex-1 pt-24 pb-24 md:pb-12 max-w-3xl mx-auto w-full px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">Order #AH-8492</h1>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
              Arriving in ~20 mins
            </Badge>
          </div>
        </div>
        
        {/* Status Tracker */}
        <Card className="border-border shadow-sm mb-8 overflow-hidden">
          <CardHeader className="bg-accent/30 pb-4 border-b border-border">
            <CardTitle className="font-heading text-xl">Tracking Status</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="relative pl-8 space-y-10 py-4">
              {/* Vertical line connecting steps */}
              <div className="absolute left-[2.25rem] top-8 bottom-8 w-0.5 bg-muted"></div>
              {/* Active portion of line */}
              <div className="absolute left-[2.25rem] top-8 bottom-[50%] w-0.5 bg-primary"></div>
              
              {steps.map((step, idx) => (
                <div key={idx} className="relative">
                  <div className={`absolute -left-12 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-background z-10 transition-colors ${step.completed ? "border-primary text-primary" : step.active ? "border-primary text-primary" : "border-muted text-muted-foreground"}`}>
                    <span className="material-symbols-outlined text-[16px]">{step.icon}</span>
                  </div>
                  <div>
                    <h3 className={`font-semibold text-lg ${step.active ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{step.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card className="border-border shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="font-heading text-xl">Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">1x Hearth-Smoked Ribeye</span>
                <span className="font-medium">$45.00</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">2x Heirloom Tomato Bruschetta</span>
                <span className="font-medium">$24.00</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center font-bold">
                <span>Total</span>
                <span>$79.86</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
