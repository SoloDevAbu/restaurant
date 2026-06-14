import type { FastifyPluginAsync } from "fastify";
import { createOrder } from "../services/order.service";
import { placeOrderSchema } from "../schemas/order.schema";

const ordersRoutes: FastifyPluginAsync = async (fastify) => {
  // POST /api/orders — customer places an order (no auth required)
  fastify.post("/", { schema: placeOrderSchema }, async (request, reply) => {
    const body = request.body as {
      customerName: string;
      customerPhone: string;
      deliveryAddress: string;
      notes?: string;
      items: Array<{ menuItemId: number; quantity: number }>;
    };

    try {
      const order = await createOrder(fastify.db, {
        customerId: null,
        customerName: body.customerName,
        customerPhone: body.customerPhone,
        deliveryAddress: body.deliveryAddress,
        notes: body.notes,
        totalAmount: "0",
        items: body.items,
      });

      reply.code(201);
      return order;
    } catch (err: unknown) {
      const error = err as Error & { statusCode?: number };
      throw {
        statusCode: 400,
        message: error.message ?? "Failed to place order",
      };
    }
  });
};

export default ordersRoutes;
