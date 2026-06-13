import { eq, sql, gte, lt, count, sum, desc } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type * as schema from "../../schema";
import { orders, menuItems } from "../../schema";

type DB = NodePgDatabase<typeof schema>;

export async function getDashboardStats(db: DB) {
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setUTCHours(23, 59, 59, 999);

  const [
    todayOrdersResult,
    todayRevenueResult,
    pendingOrdersResult,
    activeMenuItemsResult,
    recentOrdersResult,
  ] = await Promise.all([
    // Count of today's orders (excluding cancelled)
    db
      .select({ count: count() })
      .from(orders)
      .where(
        sql`${orders.createdAt} >= ${todayStart}
          AND ${orders.createdAt} <= ${todayEnd}
          AND ${orders.status} != 'cancelled'`,
      ),

    // Revenue from delivered orders today
    db
      .select({ total: sum(orders.totalAmount) })
      .from(orders)
      .where(
        sql`${orders.createdAt} >= ${todayStart}
          AND ${orders.createdAt} <= ${todayEnd}
          AND ${orders.status} = 'delivered'`,
      ),

    // Currently pending orders (all time)
    db
      .select({ count: count() })
      .from(orders)
      .where(eq(orders.status, "pending")),

    // Available menu items
    db
      .select({ count: count() })
      .from(menuItems)
      .where(eq(menuItems.isAvailable, true)),

    // 5 most recent orders
    db
      .select({
        id: orders.id,
        customerId: orders.customerId,
        customerName: orders.customerName,
        customerPhone: orders.customerPhone,
        deliveryAddress: orders.deliveryAddress,
        notes: orders.notes,
        status: orders.status,
        totalAmount: orders.totalAmount,
        deliveryManId: orders.deliveryManId,
        estimatedMinutes: orders.estimatedMinutes,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
      })
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(5),
  ]);

  return {
    todayOrders: todayOrdersResult[0]?.count ?? 0,
    todayRevenue: todayRevenueResult[0]?.total ?? "0.00",
    pendingOrders: pendingOrdersResult[0]?.count ?? 0,
    activeMenuItems: activeMenuItemsResult[0]?.count ?? 0,
    recentOrders: recentOrdersResult,
  };
}
