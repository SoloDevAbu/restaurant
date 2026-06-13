import type { FastifyPluginAsync } from "fastify";
import { findAllOrders, findOrderById } from "@repo/db/queries";
import { updateOrderStatus } from "../../services/order.service";
import {
  getOrdersSchema,
  getOrderSchema,
  updateOrderStatusSchema,
} from "../../schemas/order.schema";

const ordersRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /api/admin/orders
  fastify.get("/", { schema: getOrdersSchema }, async (request) => {
    const query = request.query as {
      page?: number;
      limit?: number;
      status?: string;
      date?: string;
      search?: string;
    };

    return findAllOrders(fastify.db, query);
  });

  // GET /api/admin/orders/:id
  fastify.get("/:id", { schema: getOrderSchema }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const order = await findOrderById(fastify.db, id);
    if (!order) throw { statusCode: 404, message: "Order not found" };
    return order;
  });

  // PATCH /api/admin/orders/:id/status
  fastify.patch(
    "/:id/status",
    { schema: updateOrderStatusSchema },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const body = request.body as {
        status: string;
        deliveryManId?: number;
        estimatedMinutes?: number;
      };

      if (body.status === "out_for_delivery" && !body.deliveryManId) {
        throw {
          statusCode: 400,
          message: "deliveryManId is required when status is out_for_delivery",
        };
      }

      const updated = await updateOrderStatus(fastify.db, id, body);
      if (!updated) throw { statusCode: 404, message: "Order not found" };
      return updated;
    },
  );
};

export default ordersRoutes;
