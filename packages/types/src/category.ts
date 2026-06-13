export interface Category {
  id: number;
  name: string;
  slug: string;
  imageUrl: string | null;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
}

// Request shapes

export interface CreateCategoryBody {
  name: string;
  slug?: string;
  imageUrl?: string;
  displayOrder?: number;
}

export interface UpdateCategoryBody {
  name?: string;
  slug?: string;
  imageUrl?: string | null;
  isActive?: boolean;
  displayOrder?: number;
}

// Response shapes

export interface CategoriesListResponse {
  data: Category[];
  total: number;
}
