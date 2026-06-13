import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type * as schema from "../../schema";
import { orders, orderItems, menuItems } from "../../schema";
import type { NewOrder } from "../../index";

type DB = NodePgDatabase<typeof schema>;

export interface PlaceOrderItem {
  menuItemId: number;
  quantity: number;
}

export interface PlaceOrderData extends Omit<
  NewOrder,
  | "id"
  | "status"
  | "createdAt"
  | "updatedAt"
  | "deliveryManId"
  | "estimatedMinutes"
> {
  items: PlaceOrderItem[];
}

/**
 * Places a new order in a single transaction:
 * 1. Validates all menu items exist and are available
 * 2. Calculates total amount from current prices
 * 3. Inserts the order and all order items atomically
 */
export async function placeOrder(db: DB, data: PlaceOrderData) {
  return db.transaction(async (tx) => {
    // Fetch all menu items referenced in the order
    const menuItemIds = data.items.map((i) => i.menuItemId);
    const fetchedItems = await Promise.all(
      menuItemIds.map((id) =>
        tx
          .select({
            id: menuItems.id,
            name: menuItems.name,
            price: menuItems.price,
            isAvailable: menuItems.isAvailable,
          })
          .from(menuItems)
          .where(eq(menuItems.id, id))
          .limit(1)
          .then((r) => r[0] ?? null),
      ),
    );

    // Validate all items exist and are available
    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i]!;
      const dbItem = fetchedItems[i];
      if (!dbItem) {
        throw new Error(`Menu item ${item.menuItemId} not found`);
      }
      if (!dbItem.isAvailable) {
        throw new Error(`Menu item "${dbItem.name}" is currently unavailable`);
      }
    }

    // Calculate total
    let total = 0;
    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i]!;
      const dbItem = fetchedItems[i]!;
      total += parseFloat(dbItem.price) * item.quantity;
    }

    // Insert the order
    const orderResult = await tx
      .insert(orders)
      .values({
        customerId: data.customerId,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        deliveryAddress: data.deliveryAddress,
        notes: data.notes,
        totalAmount: total.toFixed(2),
        status: "pending",
      })
      .returning();

    const order = orderResult[0]!;

    // Insert all order items (snapshot prices + names)
    await tx.insert(orderItems).values(
      data.items.map((item, i) => ({
        orderId: order.id,
        menuItemId: item.menuItemId,
        itemName: fetchedItems[i]!.name,
        quantity: item.quantity,
        unitPrice: fetchedItems[i]!.price,
      })),
    );

    return order;
  });
}

/** Get a single order with items for the customer confirmation view */
export async function findOrderByIdForCustomer(db: DB, id: string) {
  const orderResult = await db
    .select()
    .from(orders)
    .where(eq(orders.id, id))
    .limit(1);

  const order = orderResult[0] ?? null;
  if (!order) return null;

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

  return { ...order, items };
}
