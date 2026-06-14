"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useCategories } from "@/hooks/customer/useCategories";
import { useMenuItems } from "@/hooks/customer/useMenu";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

function MenuContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const defaultCategoryId = searchParams.get("category");

  const [activeCategoryId, setActiveCategoryId] = useState<number | "all">(
    defaultCategoryId ? parseInt(defaultCategoryId) : "all"
  );
  const [dietType, setDietType] = useState<"all" | "veg" | "non_veg">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    if (defaultCategoryId) {
      setActiveCategoryId(parseInt(defaultCategoryId));
    }
  }, [defaultCategoryId]);

  const handleCategoryChange = (id: number | "all") => {
    setActiveCategoryId(id);
    if (id === "all") {
      router.push("/menu", { scroll: false });
    } else {
      router.push(`/menu?category=${id}`, { scroll: false });
    }
  };

  const { data: categories, isLoading: isCategoriesLoading } = useCategories();

  const filters: any = {};
  if (activeCategoryId !== "all") filters.categoryId = activeCategoryId;
  if (dietType !== "all") filters.dietType = dietType;
  if (debouncedSearch) filters.search = debouncedSearch;

  const { data: menuItems, isLoading: isMenuLoading } = useMenuItems(filters);

  return (
    <>
      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground">
          <Search size={22} />
        </div>
        <Input
          type="text"
          placeholder="Search dishes, cuisines..."
          className="rounded-2xl border border-border bg-card py-7 pl-12 text-[16px] shadow-sm placeholder:text-muted-foreground focus-visible:ring-primary/20"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="mb-8 flex flex-col gap-6">
        {/* Categories Filter Pills */}
        <ScrollArea className="w-full">
          <div className="flex w-max space-x-3 p-1">
            <button
              onClick={() => handleCategoryChange("all")}
              className={`flex items-center gap-2 rounded-full border px-5 py-2.5 font-medium whitespace-nowrap transition-all duration-200 ${
                activeCategoryId === "all"
                  ? "border-primary bg-primary text-primary-foreground shadow-md"
                  : "border-border bg-card text-foreground shadow-sm hover:bg-accent"
              }`}
            >
              All
            </button>
            {isCategoriesLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-[46px] w-32 rounded-full" />
                ))
              : categories?.map((cat: any) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`flex items-center gap-2 rounded-full border px-5 py-2.5 font-medium whitespace-nowrap transition-all duration-200 ${
                      activeCategoryId === cat.id
                        ? "border-primary bg-primary text-primary-foreground shadow-md"
                        : "border-border bg-card text-foreground shadow-sm hover:bg-accent"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
          </div>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>

        {/* Header & Diet Type Dropdown */}
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
            Our Menu
          </h1>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline-block">
              {menuItems?.length || 0} items
            </span>
            <Select
              value={dietType}
              onValueChange={(val: any) => setDietType(val)}
            >
              <SelectTrigger className="h-10 w-[140px] rounded-xl border-border bg-card shadow-sm focus:ring-1 focus:ring-primary">
                <SelectValue placeholder="Diet Type" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/50 shadow-lg">
                <SelectItem value="all" className="rounded-lg">
                  All Types
                </SelectItem>
                <SelectItem value="veg" className="rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="flex h-3 w-3 items-center justify-center rounded-sm border border-green-600">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-600"></div>
                    </div>
                    Veg
                  </div>
                </SelectItem>
                <SelectItem value="non_veg" className="rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="flex h-3 w-3 items-center justify-center rounded-sm border border-red-600">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-600"></div>
                    </div>
                    Non-Veg
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {isMenuLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
            >
              <Skeleton className="h-44 w-full" />
              <div className="flex flex-col gap-3 p-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="mt-2 flex items-center justify-between">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-8 w-20 rounded-lg" />
                </div>
              </div>
            </div>
          ))
        ) : menuItems && menuItems.length > 0 ? (
          menuItems.map((item: any) => (
            <div
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md"
            >
              {/* Image Section */}
              <div className="relative h-44 overflow-hidden bg-muted sm:h-48">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-accent/30 text-muted-foreground/40">
                    <span className="material-symbols-outlined mb-2 text-4xl">
                      restaurant
                    </span>
                    <span className="text-sm font-medium">No Image</span>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="flex flex-1 flex-col p-4">
                <div className="mb-1 flex items-start gap-2">
                  {/* Veg/Non-Veg Icon */}
                  <div className="mt-1 shrink-0">
                    {item.dietType === "veg" ? (
                      <div className="flex h-4 w-4 items-center justify-center rounded-[3px] border-[1.5px] border-green-600 bg-background">
                        <div className="h-2 w-2 rounded-full bg-green-600"></div>
                      </div>
                    ) : item.dietType === "non_veg" ? (
                      <div className="flex h-4 w-4 items-center justify-center rounded-[3px] border-[1.5px] border-red-600 bg-background">
                        <div className="h-2 w-2 rounded-full bg-red-600"></div>
                      </div>
                    ) : (
                      <div className="flex h-4 w-4 items-center justify-center rounded-[3px] border-[1.5px] border-muted-foreground bg-background">
                        <div className="h-2 w-2 rounded-full bg-muted-foreground"></div>
                      </div>
                    )}
                  </div>
                  <h3 className="line-clamp-2 font-heading text-lg leading-tight font-bold text-foreground">
                    {item.name}
                  </h3>
                </div>

                {/* Rating & Time Mock Placeholder */}
                <div className="mb-5 flex items-center gap-3 pl-[26px] text-[13px] font-medium text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="text-[16px] text-yellow-500">★</span> 4.3
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">
                      schedule
                    </span>{" "}
                    20 min
                  </span>
                </div>

                <div className="mt-auto flex items-center justify-between pl-1">
                  <span className="text-xl font-bold tracking-tight text-foreground">
                    ₹{parseFloat(item.price).toString().replace(/\.00$/, "")}
                  </span>
                  <button className="flex items-center gap-1 rounded-lg bg-[#ea580c] px-5 py-1.5 font-semibold text-white shadow-sm transition-colors hover:bg-[#c2410c] active:scale-95">
                    <span className="mb-[2px] text-lg leading-none font-light">
                      +
                    </span>{" "}
                    ADD
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/50 bg-accent/20 py-20 text-muted-foreground">
            <p className="mb-2 text-xl font-medium text-foreground">
              No items found
            </p>
            <p className="max-w-sm text-center text-sm">
              Try adjusting your search or switching to a different category.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default function MenuPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc] dark:bg-background">
      <Navbar variant="user" />

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 pt-24 pb-24 sm:px-6 md:pb-16">
        <Suspense
          fallback={
            <div className="py-2 text-center">
              <Skeleton className="mb-8 h-16 w-full rounded-2xl" />
              <div className="mb-10 flex gap-4">
                <Skeleton className="h-12 w-24 rounded-full" />
                <Skeleton className="h-12 w-32 rounded-full" />
                <Skeleton className="h-12 w-32 rounded-full" />
              </div>
              <div className="mb-8 flex justify-between">
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-10 w-36 rounded-xl" />
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-[340px] w-full rounded-2xl" />
                ))}
              </div>
            </div>
          }
        >
          <MenuContent />
        </Suspense>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
