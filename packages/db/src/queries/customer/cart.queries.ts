import { eq, sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type * as schema from "../../schema";
import { cartItems, menuItems } from "../../schema";

type DB = NodePgDatabase<typeof schema>;

// ─── Cart queries ──────────────────────────────────────────────────────────

/** Return all cart items for a user, joined with menu item details */
export async function getCartItems(db: DB, userId: number) {
  return db
    .select({
      id: cartItems.id,
      menuItemId: cartItems.menuItemId,
      quantity: cartItems.quantity,
      addedAt: cartItems.addedAt,
      name: menuItems.name,
      price: menuItems.price,
      imageUrl: menuItems.imageUrl,
      isAvailable: menuItems.isAvailable,
    })
    .from(cartItems)
    .innerJoin(menuItems, eq(cartItems.menuItemId, menuItems.id))
    .where(eq(cartItems.userId, userId));
}

/**
 * Add an item to cart or update its quantity.
 * If quantity ≤ 0 the item is removed instead.
 */
export async function upsertCartItem(
  db: DB,
  userId: number,
  menuItemId: number,
  quantity: number,
) {
  if (quantity <= 0) {
    return removeCartItem(db, userId, menuItemId);
  }

  await db
    .insert(cartItems)
    .values({ userId, menuItemId, quantity })
    .onConflictDoUpdate({
      target: [cartItems.userId, cartItems.menuItemId],
      set: { quantity },
    });
}

/** Remove a single item from the cart */
export async function removeCartItem(
  db: DB,
  userId: number,
  menuItemId: number,
) {
  await db
    .delete(cartItems)
    .where(
      sql`${cartItems.userId} = ${userId} AND ${cartItems.menuItemId} = ${menuItemId}`,
    );
}

/** Remove all items from a user's cart */
export async function clearCart(db: DB, userId: number) {
  await db.delete(cartItems).where(eq(cartItems.userId, userId));
}

/** Compute cart total: sum of (price × quantity) for all items */
export async function getCartTotal(db: DB, userId: number): Promise<string> {
  const result = await db
    .select({
      total: sql<string>`COALESCE(SUM(${menuItems.price} * ${cartItems.quantity}), 0)::text`,
    })
    .from(cartItems)
    .innerJoin(menuItems, eq(cartItems.menuItemId, menuItems.id))
    .where(eq(cartItems.userId, userId));

  return result[0]?.total ?? "0";
}
