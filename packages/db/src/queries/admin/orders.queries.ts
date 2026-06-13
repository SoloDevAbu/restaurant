import { eq, and, ilike, or, sql, count, desc, gte, lt } from "drizzle-orm";
import type * as schema from "../../schema";
import { orders, orderItems, menuItems, users } from "../../schema";
import type { DB, OrderStatus } from "../../index";

export interface OrdersFilter {
  page?: number;
  limit?: number;
  status?: string;
  date?: string;
  search?: string;
}

export async function findAllOrders(db: DB, filter: OrdersFilter = {}) {
  const page = filter.page ?? 1;
  const limit = filter.limit ?? 20;
  const offset = (page - 1) * limit;
  const dateStr = filter.date ?? new Date().toISOString().split("T")[0]!;
  const dayStart = new Date(`${dateStr}T00:00:00.000Z`);
  const dayEnd = new Date(`${dateStr}T23:59:59.999Z`);

  const conditions = [
    gte(orders.createdAt, dayStart),
    lt(orders.createdAt, dayEnd),
  ];

  if (filter.status) {
    conditions.push(eq(orders.status, filter.status as OrderStatus));
  }

  if (filter.search) {
    const term = `%${filter.search}%`;
    conditions.push(
      or(ilike(orders.customerName, term), ilike(orders.customerPhone, term))!,
    );
  }

  const where = and(...conditions);

  const [rows, totalResult] = await Promise.all([
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
      .where(where)
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset),

    db.select({ count: count() }).from(orders).where(where),
  ]);

  return {
    data: rows,
    total: totalResult[0]?.count ?? 0,
    page,
    limit,
  };
}

export async function findOrderById(db: DB, id: string) {
  // Fetch order
  const orderResult = await db
    .select()
    .from(orders)
    .where(eq(orders.id, id))
    .limit(1);

  const order = orderResult[0] ?? null;
  if (!order) return null;

  // Fetch items with menu item name
  const items = await db
    .select({
      id: orderItems.id,
      menuItemId: orderItems.menuItemId,
      itemName: orderItems.itemName,
      quantity: orderItems.quantity,
      unitPrice: orderItems.unitPrice,
    })
    .from(orderItems)
    .where(eq(orderItems.orderId, id));

  // Fetch delivery man name if assigned
  let deliveryMan: { name: string } | null = null;
  if (order.deliveryManId) {
    const dmResult = await db
      .select({ name: users.name })
      .from(users)
      .where(eq(users.id, order.deliveryManId))
      .limit(1);
    deliveryMan = dmResult[0] ?? null;
  }

  return { ...order, items, deliveryMan };
}

export async function updateOrderStatus(
  db: DB,
  id: string,
  data: {
    status: string;
    deliveryManId?: number;
    estimatedMinutes?: number;
  },
) {
  const result = await db
    .update(orders)
    .set({
      status: data.status as OrderStatus,
      deliveryManId: data.deliveryManId ?? undefined,
      estimatedMinutes: data.estimatedMinutes ?? undefined,
      updatedAt: sql`now()`,
    })
    .where(eq(orders.id, id))
    .returning();

  return result[0] ?? null;
}
