import { eq, and, sql, count, asc } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type * as schema from "../../schema";
import { menuItems, categories } from "../../schema";
import type { NewMenuItem } from "../../index";

type DB = NodePgDatabase<typeof schema>;

export interface MenuItemFilters {
  categoryId?: number;
  isFeatured?: boolean;
  dietType?: string;
  isAvailable?: boolean;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export async function findAllMenuItems(
  db: DB,
  filters: MenuItemFilters = {},
  pagination: PaginationOptions = { page: 1, limit: 20 },
) {
  const conditions = [];

  if (filters.categoryId !== undefined) {
    conditions.push(eq(menuItems.categoryId, filters.categoryId));
  }
  if (filters.isFeatured !== undefined) {
    conditions.push(eq(menuItems.isFeatured, filters.isFeatured));
  }
  if (filters.dietType !== undefined) {
    conditions.push(eq(menuItems.dietType, filters.dietType as any));
  }
  if (filters.isAvailable !== undefined) {
    conditions.push(eq(menuItems.isAvailable, filters.isAvailable));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const offset = (pagination.page - 1) * pagination.limit;

  const [rows, totalResult] = await Promise.all([
    db
      .select({
        id: menuItems.id,
        categoryId: menuItems.categoryId,
        categoryName: categories.name,
        name: menuItems.name,
        description: menuItems.description,
        price: menuItems.price,
        imageUrl: menuItems.imageUrl,
        isAvailable: menuItems.isAvailable,
        isFeatured: menuItems.isFeatured,
        featuredTag: menuItems.featuredTag,
        dietType: menuItems.dietType,
        displayOrder: menuItems.displayOrder,
        createdAt: menuItems.createdAt,
        updatedAt: menuItems.updatedAt,
      })
      .from(menuItems)
      .leftJoin(categories, eq(menuItems.categoryId, categories.id))
      .where(where)
      .orderBy(asc(menuItems.displayOrder), asc(menuItems.name))
      .limit(pagination.limit)
      .offset(offset),

    db.select({ count: count() }).from(menuItems).where(where),
  ]);

  return {
    data: rows,
    total: totalResult[0]?.count ?? 0,
    page: pagination.page,
    limit: pagination.limit,
  };
}

export async function findMenuItemById(db: DB, id: number) {
  const result = await db
    .select({
      id: menuItems.id,
      categoryId: menuItems.categoryId,
      categoryName: categories.name,
      name: menuItems.name,
      description: menuItems.description,
      price: menuItems.price,
      imageUrl: menuItems.imageUrl,
      isAvailable: menuItems.isAvailable,
      isFeatured: menuItems.isFeatured,
      featuredTag: menuItems.featuredTag,
      dietType: menuItems.dietType,
      displayOrder: menuItems.displayOrder,
      createdAt: menuItems.createdAt,
      updatedAt: menuItems.updatedAt,
    })
    .from(menuItems)
    .leftJoin(categories, eq(menuItems.categoryId, categories.id))
    .where(eq(menuItems.id, id))
    .limit(1);

  return result[0] ?? null;
}

export async function createMenuItem(
  db: DB,
  data: Omit<NewMenuItem, "id" | "createdAt" | "updatedAt">,
) {
  const result = await db.insert(menuItems).values(data).returning();
  return result[0]!;
}

export async function updateMenuItem(
  db: DB,
  id: number,
  data: Partial<Omit<NewMenuItem, "id" | "createdAt">>,
) {
  const result = await db
    .update(menuItems)
    .set({ ...data, updatedAt: sql`now()` })
    .where(eq(menuItems.id, id))
    .returning();

  return result[0] ?? null;
}

export async function toggleMenuItemAvailability(
  db: DB,
  id: number,
  isAvailable: boolean,
) {
  const result = await db
    .update(menuItems)
    .set({ isAvailable, updatedAt: sql`now()` })
    .where(eq(menuItems.id, id))
    .returning();

  return result[0] ?? null;
}

export async function deleteMenuItem(db: DB, id: number) {
  const result = await db
    .delete(menuItems)
    .where(eq(menuItems.id, id))
    .returning();

  return result[0] ?? null;
}
