import { eq, asc } from "drizzle-orm";
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
