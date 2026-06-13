export type DietType = "veg" | "non_veg" | "vegan";
export type FeaturedTag =
  | "must_try"
  | "main_course"
  | "combo"
  | "dessert"
  | "drink";

export interface MenuItem {
  id: number;
  categoryId: number;
  categoryName?: string; // populated in list responses via join
  name: string;
  description: string | null;
  price: string; // numeric stored as string to preserve precision
  imageUrl: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  featuredTag: FeaturedTag | null;
  dietType: DietType | null;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Request shapes

export interface CreateMenuItemBody {
  categoryId: number;
  name: string;
  description?: string;
  price: string;
  imageUrl?: string;
  isAvailable?: boolean;
  isFeatured?: boolean;
  featuredTag?: FeaturedTag;
  dietType?: DietType;
  displayOrder?: number;
}

export interface UpdateMenuItemBody {
  categoryId?: number;
  name?: string;
  description?: string | null;
  price?: string;
  imageUrl?: string | null;
  isAvailable?: boolean;
  isFeatured?: boolean;
  featuredTag?: FeaturedTag | null;
  dietType?: DietType | null;
  displayOrder?: number;
}

export interface ToggleAvailabilityBody {
  isAvailable: boolean;
}

// Response shapes

export interface MenuItemsListResponse {
  data: MenuItem[];
  total: number;
  page: number;
  limit: number;
}

export interface MenuItemsQuery {
  categoryId?: number;
  isFeatured?: boolean;
  dietType?: DietType;
  isAvailable?: boolean;
  page?: number;
  limit?: number;
}
