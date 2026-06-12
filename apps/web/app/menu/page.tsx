import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const menuItems = {
  starters: [
    { name: "Wood-Fired Garlic Bread", price: "$8", desc: "House-made sourdough, roasted garlic butter, parsley.", img: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&q=80&w=800" },
    { name: "Heirloom Tomato Bruschetta", price: "$12", desc: "Fresh basil, balsamic glaze, on grilled ciabatta.", img: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&q=80&w=800" },
    { name: "Roasted Bone Marrow", price: "$18", desc: "Parsley salad, capers, toasted sourdough.", img: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=800" }
  ],
  mains: [
    { name: "Hearth-Smoked Ribeye", price: "$45", desc: "48-hour cured, served with seasonal greens.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0za5YwYXInG46nYTU42c18PPykxmHwQiHH27l5_aRpUDO88qo74c-dCoMZab9nGSGkAXzsMlKFDgBdfGMSXiorYST6frpkZ3SL_LGeWB7HZ0Z32IE_SYgpwm05pcptl6w6g_sBUDFcH9KCgzDNeBEOrmAeqvO5LXM6BxUmN8gruQMtnXyN8KAnPZ_IggOGgIdzoinCCQb5fw33ObYMdmfaN2SWfctLCcTqCWiqePKrxI3RiVOcjB10sv_eSPgmrKqMmgzt9DvRi9M" },
    { name: "Traditional Margherita", price: "$22", desc: "San Marzano tomatoes, fresh mozzarella, basil.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5SFsO4wQybKVkCz94xS4JcsOTyGwf6WDOLDKSt5g79C4w9sDMOk5AK8JDhsrNku4lfaJg_c8oUysNoI-V-vc1ZD3s6hRdkLeJGgx3sxvIrBp97ayC2oMJ4UuwlASOqCXm2rtY2lvdoh95nny5lLKiHfWL4HvNspebEMje2DSLBmPJmxdvxKOWWmS9BihllYgaO9DKcT5mPpSmMKdVyzUWGdPQ9Xnl50qjBs2yC2N5DsVEcY7nNK_H7tO5LBxdLa5tzDMy2f_Mu6Fq" },
    { name: "Wild Mushroom Risotto", price: "$28", desc: "Arborio rice, truffle oil, parmesan crisp.", img: "https://images.unsplash.com/photo-1633337474564-1d9e26210219?auto=format&fit=crop&q=80&w=800" }
  ],
  desserts: [
    { name: "Chocolate Lava Cake", price: "$14", desc: "Warm ganache center, vanilla bean ice cream.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrdq67bHJXYuVochi2qU3X3zrWUYDaVKA_dIorjlI4cDTvYqxQs-etfgoGtvsllUczFED-_PZeI8cDX3O8r1bmeHH1UPGyf3V_8TaR81g-FtcjskU1LNeEa016mfRA88Ki1dSVXAdswyOa1Wpm6867xMEL8UwUtFTyyErw-bGRd5o8FtOmk421HprWuNNS70GnQ8fH6pGjGmXEjEpM2q_On8aRtyxo7gFip8b-VYcWa33ULYYQRhJUMlGU5JfDbQcKrygYJmEQe100" },
    { name: "Wood-Fired Peach Cobbler", price: "$12", desc: "Brown sugar streusel, caramel drizzle.", img: "https://images.unsplash.com/photo-1511018556340-d16986a1c194?auto=format&fit=crop&q=80&w=800" }
  ]
};

export default function MenuPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar variant="user" />
      
      <main className="flex-1 pt-24 pb-24 md:pb-12 max-w-7xl mx-auto w-full px-4">
        <div className="mb-8">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">Our Menu</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">Discover our artisanal offerings, prepared fresh daily in our traditional wood-fired hearth.</p>
        </div>

        <Tabs defaultValue="starters" className="w-full">
          <ScrollArea className="w-full mb-8">
            <TabsList className="w-full justify-start h-12 bg-accent/50 p-1">
              <TabsTrigger value="starters" className="text-base px-6 h-10">Starters</TabsTrigger>
              <TabsTrigger value="mains" className="text-base px-6 h-10">Mains</TabsTrigger>
              <TabsTrigger value="desserts" className="text-base px-6 h-10">Desserts</TabsTrigger>
              <TabsTrigger value="drinks" className="text-base px-6 h-10">Drinks</TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" className="invisible" />
          </ScrollArea>

          {Object.entries(menuItems).map(([category, items]) => (
            <TabsContent key={category} value={category} className="mt-0 outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item, idx) => (
                  <Card key={idx} className="overflow-hidden flex flex-col group border-border transition-all hover:shadow-md">
                    <div className="relative h-56 overflow-hidden bg-muted">
                      <img 
                        src={item.img} 
                        alt={item.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <Badge className="absolute top-4 right-4 bg-background/80 text-foreground backdrop-blur-sm border-none shadow-sm font-semibold">
                        {item.price}
                      </Badge>
                    </div>
                    <CardHeader className="p-5 pb-2">
                      <CardTitle className="font-heading text-xl text-foreground">{item.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-0 flex-1">
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                    </CardContent>
                    <CardFooter className="p-5 pt-0">
                      <Button className="w-full font-semibold transition-transform active:scale-95">Add to Order</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
          <TabsContent value="drinks" className="mt-0">
            <div className="p-12 text-center text-muted-foreground border border-dashed rounded-xl border-border bg-accent/30">
              <span className="material-symbols-outlined text-4xl mb-4 block text-primary/50">local_bar</span>
              <p className="text-lg">Drinks menu coming soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
