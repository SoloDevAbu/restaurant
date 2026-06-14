import { eq, asc, and, ilike, type SQL } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type * as schema from "../../schema";
import { categories, menuItems } from "../../schema";

type DB = NodePgDatabase<typeof schema>;

/**
 * Returns all active categories with their available menu items.
 * Used by the public-facing menu page — no auth required.
 */
export async function getPublicMenu(db: DB) {
  const activeCategories = await db
    .select()
    .from(categories)
    .where(eq(categories.isActive, true))
    .orderBy(asc(categories.displayOrder), asc(categories.name));

  const availableItems = await db
    .select()
    .from(menuItems)
    .where(eq(menuItems.isAvailable, true))
    .orderBy(asc(menuItems.displayOrder), asc(menuItems.name));

  return activeCategories.map((category) => ({
    ...category,
    items: availableItems.filter((item) => item.categoryId === category.id),
  }));
}

/**
 * Returns all featured menu items (isFeatured = true and isAvailable = true).
 * Used for featured sections on the home page.
 */
export async function getFeaturedItems(db: DB) {
  return db
    .select({
      id: menuItems.id,
      categoryId: menuItems.categoryId,
      categoryName: categories.name,
      name: menuItems.name,
      description: menuItems.description,
      price: menuItems.price,
      imageUrl: menuItems.imageUrl,
      isFeatured: menuItems.isFeatured,
      featuredTag: menuItems.featuredTag,
      dietType: menuItems.dietType,
      displayOrder: menuItems.displayOrder,
    })
    .from(menuItems)
    .leftJoin(categories, eq(menuItems.categoryId, categories.id))
    .where(eq(menuItems.isFeatured, true))
    .orderBy(asc(menuItems.displayOrder));
}

/**
 * Returns filtered menu items (must be available).
 * Allows filtering by category and diet type.
 */
export async function getMenuItemsFiltered(
  db: DB,
  filters: { categoryId?: number; dietType?: string; search?: string }
) {
  const conditions: SQL<unknown>[] = [eq(menuItems.isAvailable, true)];

  if (filters.categoryId) {
    conditions.push(eq(menuItems.categoryId, filters.categoryId));
  }

  if (filters.dietType) {
    conditions.push(eq(menuItems.dietType, filters.dietType as any));
  }

  if (filters.search) {
    conditions.push(ilike(menuItems.name, `%${filters.search}%`));
  }

  return db
    .select({
      id: menuItems.id,
      categoryId: menuItems.categoryId,
      categoryName: categories.name,
      name: menuItems.name,
      description: menuItems.description,
      price: menuItems.price,
      imageUrl: menuItems.imageUrl,
      isFeatured: menuItems.isFeatured,
      featuredTag: menuItems.featuredTag,
      dietType: menuItems.dietType,
      displayOrder: menuItems.displayOrder,
    })
    .from(menuItems)
    .leftJoin(categories, eq(menuItems.categoryId, categories.id))
    .where(and(...conditions))
    .orderBy(asc(menuItems.displayOrder));
}
