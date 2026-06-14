"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useCategories } from "@/hooks/customer/useCategories";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar variant="user" />
      
      <main className="flex-1 pt-24 pb-24 md:pb-12 max-w-7xl mx-auto w-full px-4">
        <div className="mb-10 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">Our Categories</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our artisanal offerings by category.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square relative rounded-xl overflow-hidden shadow-sm">
                <Skeleton className="w-full h-full" />
              </div>
            ))
          ) : (
            categories?.map((category: any) => (
              <Link href={`/menu?category=${category.id}`} key={category.id} className="group">
                <div className="aspect-square relative rounded-xl overflow-hidden shadow-sm border border-border transition-transform duration-300 group-hover:scale-[1.02]">
                  {category.imageUrl ? (
                    <img 
                      src={category.imageUrl} 
                      alt={category.name} 
                      className="w-full h-full object-cover bg-muted" 
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                      No image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <h2 className="font-heading font-bold text-2xl md:text-3xl text-white text-center tracking-wide shadow-black/50 drop-shadow-md">
                      {category.name}
                    </h2>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
