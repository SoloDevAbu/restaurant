import { eq, count } from "drizzle-orm";
import type * as schema from "../../schema";
import { categories } from "../../schema";
import type { NewCategory, DB } from "../../index";

// Helpers

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

// Queries

/** Returns ALL categories (including inactive) for the admin view */
export async function findAllCategories(db: DB) {
  return db
    .select()
    .from(categories)
    .orderBy(categories.displayOrder, categories.name);
}

export async function findCategoryById(db: DB, id: number) {
  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);

  return result[0] ?? null;
}

export async function findCategoryBySlug(db: DB, slug: string) {
  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);

  return result[0] ?? null;
}

export async function createCategory(
  db: DB,
  data: Omit<NewCategory, "id" | "createdAt" | "slug"> & { slug?: string },
) {
  const slug = data.slug ?? slugify(data.name);
  const result = await db
    .insert(categories)
    .values({ ...data, slug })
    .returning();

  return result[0]!;
}

export async function updateCategory(
  db: DB,
  id: number,
  data: Partial<Omit<NewCategory, "id" | "createdAt">>,
) {
  const result = await db
    .update(categories)
    .set(data)
    .where(eq(categories.id, id))
    .returning();

  return result[0] ?? null;
}

/**
 * Hard-deletes the category.
 * Call only after checking no menu items reference it.
 * */
export async function deleteCategory(db: DB, id: number) {
  const result = await db
    .delete(categories)
    .where(eq(categories.id, id))
    .returning();

  return result[0] ?? null;
}

/** Count menu items linked to this category (used before allowing hard delete) */
export async function countMenuItemsByCategory(db: DB, categoryId: number) {
  const { menuItems } = await import("../../schema.js");
  const result = await db
    .select({ count: count() })
    .from(menuItems)
    .where(eq(menuItems.categoryId, categoryId));

  return result[0]?.count ?? 0;
}
