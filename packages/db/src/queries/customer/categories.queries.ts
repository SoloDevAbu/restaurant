import { eq, asc } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type * as schema from "../../schema";
import { categories } from "../../schema";

type DB = NodePgDatabase<typeof schema>;

/**
 * Returns all active categories.
 * Used by the public-facing categories page — no auth required.
 */
export async function getPublicCategories(db: DB) {
  return db
    .select()
    .from(categories)
    .where(eq(categories.isActive, true))
    .orderBy(asc(categories.displayOrder), asc(categories.name));
}
