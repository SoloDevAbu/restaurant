import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar variant="user" />
      
      <main className="flex-1 pt-16 pb-20 md:pb-0">
        {/* Hero Section */}
        <section className="relative w-full h-[618px] min-h-[500px] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAt-NoDebuA7n2wabXLsZsKwyEjabOYOZAzw-bW5SyM6tsz56IejEsnkqzUTNHvTmYuxHVe78SBRM7rz6cvXo8LKJmqfaWXw_-0PGgVhnR6HgWiK35C--o8bCQXScjDGB-3owO2uIVAyZtBWrE5oUpfdjDLrwg0-D2SXd0u1Eepi5PJ1b2O2iu3XBiduVsaT2MExYWakrgNN-AZtNrpF1GCXw4MD49jcop8HoObSTTj98DGqk28P95q-UxzOle3uADaC5ywwL1-xm2g')" }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60"></div>
          </div>
          <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-center items-start text-white">
            <h1 className="font-heading text-4xl md:text-6xl mb-2 font-bold tracking-tight">Artisanal Hearth</h1>
            <p className="text-xl md:text-3xl mb-8 opacity-90 italic font-heading">Modern flavors, traditional warmth</p>
            <Button size="lg" className="text-lg px-8 py-6 rounded-md shadow-lg transition-transform active:scale-95">
              View Menu
            </Button>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-8">
              <h2 className="font-heading text-2xl md:text-3xl text-foreground font-semibold">Explore Categories</h2>
              <div className="h-1 w-12 bg-primary mt-2"></div>
            </div>
            
            <ScrollArea className="w-full whitespace-nowrap pb-4">
              <div className="flex w-max space-x-4">
                {[
                  { name: "Starters", icon: "restaurant_menu", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuARViwjWnmcvEiozUMgbgEkMQ_w0TZ1toQO6hyB22rMpiJWOO2r749do3qDHFLGHVXrStlJPT0nE_RujsDIR-3VKMy6wyyzrQHjyQh62UL0QUOoH01uf6ZyxMALsYn93HBBiheDvJ12QVUBMOMngP5m18eYmYxJcfKiH6Dq8m5mls71XQFYnrjKc6nW4T1W9lCJ5PwbqiOUIl484frvjcXk6YTAYLqSh765oUvaZOEPHBiSuRDf9bAiaCZDNTZ3PwCoHz0zVO3PhXMY" },
                  { name: "Mains", icon: "dinner_dining", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBe4LNKb-aGniAi390Rx-b9o_7Gaw6qbNHhY-4K4uYSKATGtceMwXF_W8T46Auqv9Cmad5LoJ7T0CpYK8RJAAf-bxCVqqxepCMZQfCaU_kL7aeAKWI4CWcCBi2ealopU9LDN67QxKFbAEgu_Bd0O29wCpKytspS0VT1im_r6BEXvT6JtP-1rY1EUZgJTpa5x9KROjss3YyhTHyB5tTHLNbG_yV9I1JnOX8LoheeZtxY6ACJui21SJBQ6psoVjvgGm0sz9DAW1YH-i3f" },
                  { name: "Desserts", icon: "icecream", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrdq67bHJXYuVochi2qU3X3zrWUYDaVKA_dIorjlI4cDTvYqxQs-etfgoGtvsllUczFED-_PZeI8cDX3O8r1bmeHH1UPGyf3V_8TaR81g-FtcjskU1LNeEa016mfRA88Ki1dSVXAdswyOa1Wpm6867xMEL8UwUtFTyyErw-bGRd5o8FtOmk421HprWuNNS70GnQ8fH6pGjGmXEjEpM2q_On8aRtyxo7gFip8b-VYcWa33ULYYQRhJUMlGU5JfDbQcKrygYJmEQe100" },
                  { name: "Drinks", icon: "local_bar", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDylFyIGoNE_RsRGrlCJOiHb92DrJFt7CxhOFalUYcvNyytRnHCc_mPriQxcDS8htXost2YPUkbgB7xZeg44uWpD8xSntNHQhzNJ6F3ct2IWVO4jHZO2fufOuzccT5FLOybq0KfwBqtNToW8jbR9tUVmMEqiE04wxUXo3QOIrHpHohTex2nBrJYP8W3JZSHluXh8uOpEnq3_NUxmfm47qYoMiF3U5Yv_APveFhdphNhmvcpXCpVFXJCDv90mJWsIrN4XVbEAVuFtL-C" },
                ].map((category) => (
                  <div key={category.name} className="w-[200px] md:w-[240px] shrink-0 group cursor-pointer">
                    <div className="aspect-square relative rounded-xl overflow-hidden shadow-sm border border-border transition-transform duration-300 group-hover:scale-[1.02]">
                      <img src={category.img} alt={category.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <span className="material-symbols-outlined mb-1 block text-[32px]">{category.icon}</span>
                        <p className="font-semibold text-lg">{category.name}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </section>

        {/* Featured Section */}
        <section className="py-12 bg-accent/50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="font-heading text-3xl text-foreground mb-8 font-semibold">Chef's Selection</h2>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Large Feature */}
              <Card className="md:col-span-8 overflow-hidden group border-border">
                <div className="flex flex-col md:flex-row h-full">
                  <div className="md:w-1/2 h-64 md:h-full relative overflow-hidden">
                    <img 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0za5YwYXInG46nYTU42c18PPykxmHwQiHH27l5_aRpUDO88qo74c-dCoMZab9nGSGkAXzsMlKFDgBdfGMSXiorYST6frpkZ3SL_LGeWB7HZ0Z32IE_SYgpwm05pcptl6w6g_sBUDFcH9KCgzDNeBEOrmAeqvO5LXM6BxUmN8gruQMtnXyN8KAnPZ_IggOGgIdzoinCCQb5fw33ObYMdmfaN2SWfctLCcTqCWiqePKrxI3RiVOcjB10sv_eSPgmrKqMmgzt9DvRi9M" 
                      alt="Featured" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                  </div>
                  <div className="md:w-1/2 p-8 flex flex-col justify-center bg-card">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2">LIMITED TIME</span>
                    <h3 className="font-heading text-2xl font-bold text-foreground mb-4">Hearth-Smoked Ribeye</h3>
                    <p className="text-muted-foreground mb-6 line-clamp-3">
                      48-hour cured ribeye, smoked over cherry wood and finished in our traditional clay oven. Served with seasonal greens.
                    </p>
                    <Button variant="link" className="self-start text-primary font-bold p-0 h-auto border-b-2 border-primary rounded-none hover:text-primary/80">
                      Order Now
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Small Features */}
              <div className="md:col-span-4 flex flex-col gap-6">
                <Card className="flex-1 p-4 flex items-center gap-4 hover:bg-accent transition-colors cursor-pointer border-border">
                  <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTudfKXYq5D-S5UuNK2xOKX_Y88v5cqS6oH67J0Te1e0bD5Qu1XmiSvKSqL9ReDwJxXr93NN43EzrIfHMi__f7mNhUFe1PIFRfznDKdEg-kRMFNfUsmQ-K_r1ikIMpgHdINQRxxYGeuGmfTtL1fml6TBARyMHsn9JyoL53E3H_yaceQ733u2-GWzje70GqcycGc7Smxu5mPqSK6oKdZ7_3uodJ5A3_6oGLTXVoEQWwyZjBiEVDYf0wyrqQ_6RjdYxhJZYugkGya_2y" alt="Bowl" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-lg">Garden Hearth Bowl</h4>
                    <p className="text-muted-foreground text-sm">Fresh, seasonal & vibrant</p>
                  </div>
                </Card>
                <Card className="flex-1 p-4 flex items-center gap-4 hover:bg-accent transition-colors cursor-pointer border-border">
                  <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5SFsO4wQybKVkCz94xS4JcsOTyGwf6WDOLDKSt5g79C4w9sDMOk5AK8JDhsrNku4lfaJg_c8oUysNoI-V-vc1ZD3s6hRdkLeJGgx3sxvIrBp97ayC2oMJ4UuwlASOqCXm2rtY2lvdoh95nny5lLKiHfWL4HvNspebEMje2DSLBmPJmxdvxKOWWmS9BihllYgaO9DKcT5mPpSmMKdVyzUWGdPQ9Xnl50qjBs2yC2N5DsVEcY7nNK_H7tO5LBxdLa5tzDMy2f_Mu6Fq" alt="Pizza" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-lg">Traditional Margherita</h4>
                    <p className="text-muted-foreground text-sm">Stone-baked perfection</p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
