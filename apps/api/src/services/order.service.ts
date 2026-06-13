import {
  placeOrder as placeOrderQuery,
  findOrderByIdForCustomer,
  updateOrderStatus as updateOrderStatusQuery,
  findOrderById,
} from "@repo/db/queries";
import { sseRegistry } from "./sse-registry";
import type { PlaceOrderData } from "@repo/db/queries";
import type { DB } from "@repo/db";

// Customer: place a new order

export async function createOrder(db: DB, data: PlaceOrderData) {
  const order = await placeOrderQuery(db, data);

  // Notify admin dashboard in real-time
  sseRegistry.broadcast("new_order", {
    id: order.id,
    customerName: order.customerName,
    totalAmount: order.totalAmount,
    status: order.status,
    createdAt: order.createdAt,
  });

  // Return the full order with items for the confirmation response
  return findOrderByIdForCustomer(db, order.id);
}

// Admin: update order status

export async function updateOrderStatus(
  db: DB,
  id: string,
  data: {
    status: string;
    deliveryManId?: number;
    estimatedMinutes?: number;
  },
) {
  const updated = await updateOrderStatusQuery(db, id, data);
  if (!updated) return null;

  // Push real-time status change to SSE clients
  sseRegistry.broadcast("order_status_changed", {
    id: updated.id,
    status: updated.status,
  });

  // Return full order detail
  return findOrderById(db, id);
}
