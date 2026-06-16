import type { FastifyPluginAsync } from "fastify";
import {
  signupUser,
  loginUser,
  refreshUserToken,
  logoutUser,
} from "../../services/user-auth.service";
import {
  upsertUserAddress,
  findAddressByUserId,
  getCartItems,
  upsertCartItem,
  removeCartItem,
  clearCart,
  getCartTotal,
  findOrdersByCustomerId,
  findUserById,
} from "@repo/db/queries";
import { createOrder } from "../../services/order.service";
import {
  signupSchema,
  loginSchema,
  userRefreshSchema,
  userLogoutSchema,
} from "../../schemas/user-auth.schema";
import {
  getAddressSchema,
  saveAddressSchema,
} from "../../schemas/address.schema";
import {
  getCartSchema,
  upsertCartItemSchema,
  removeCartItemSchema,
  clearCartSchema,
  checkoutSchema,
} from "../../schemas/cart.schema";

const userRoutes: FastifyPluginAsync = async (fastify) => {
  // POST /api/user/auth/signup
  fastify.post(
    "/auth/signup",
    { schema: signupSchema },
    async (request, reply) => {
      const { phone, name } = request.body as { phone: string; name: string };
      try {
        const result = await signupUser(fastify.db, fastify, name, phone);
        return reply.code(201).send(result);
      } catch (err: unknown) {
        const error = err as Error & { statusCode?: number };
        return reply
          .code((error.statusCode ?? 500) as any)
          .send({ error: error.message ?? "Signup failed" });
      }
    },
  );

  // POST /api/user/auth/login
  fastify.post(
    "/auth/login",
    { schema: loginSchema },
    async (request, reply) => {
      const { phone } = request.body as { phone: string };

      try {
        const result = await loginUser(fastify.db, fastify, phone);
        return result;
      } catch (err: unknown) {
        const error = err as Error & { statusCode?: number };
        return reply
          .code((error.statusCode ?? 500) as any)
          .send({ error: error.message ?? "Login failed" });
      }
    },
  );

  // POST /api/user/auth/refresh
  fastify.post(
    "/auth/refresh",
    { schema: userRefreshSchema },
    async (request, reply) => {
      const { refreshToken } = request.body as { refreshToken: string };

      try {
        const result = await refreshUserToken(
          fastify.db,
          fastify,
          refreshToken,
        );
        return result;
      } catch (err: unknown) {
        const error = err as Error & { statusCode?: number };
        return reply
          .code((error.statusCode ?? 500) as any)
          .send({ error: error.message ?? "Token refresh failed" });
      }
    },
  );

  // POST /api/user/auth/logout
  fastify.post(
    "/auth/logout",
    { schema: userLogoutSchema },
    async (request) => {
      const { refreshToken } = request.body as { refreshToken: string };
      await logoutUser(fastify.db, refreshToken);
      return { success: true };
    },
  );

  // ────────────────────────────────────────────────────────────────
  // ADDRESS  (requires auth)
  // ────────────────────────────────────────────────────────────────

  // GET /api/user/address
  fastify.get(
    "/address",
    {
      schema: getAddressSchema,
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      const userId = request.user.id;
      const address = await findAddressByUserId(fastify.db, userId);
      if (!address) {
        return reply
          .code(404)
          .send({ error: "NotFound", message: "No address saved yet" });
      }
      return address;
    },
  );

  // PUT /api/user/address
  fastify.put(
    "/address",
    {
      schema: saveAddressSchema,
      preHandler: [fastify.authenticate],
    },
    async (request) => {
      const userId = request.user.id;
      const body = request.body as {
        address: string;
        pincode: string;
        landmark?: string;
      };

      return upsertUserAddress(fastify.db, userId, {
        address: body.address,
        pincode: body.pincode,
        landmark: body.landmark,
      });
    },
  );

  // ────────────────────────────────────────────────────────────────
  // CART  (requires auth)
  // ────────────────────────────────────────────────────────────────

  // GET /api/user/cart
  fastify.get(
    "/cart",
    {
      schema: getCartSchema,
      preHandler: [fastify.authenticate],
    },
    async (request) => {
      const userId = request.user.id;
      const [items, total] = await Promise.all([
        getCartItems(fastify.db, userId),
        getCartTotal(fastify.db, userId),
      ]);

      const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
      return { items, total, itemCount };
    },
  );

  // POST /api/user/cart — add or update item quantity (quantity=0 removes)
  fastify.post(
    "/cart",
    {
      schema: upsertCartItemSchema,
      preHandler: [fastify.authenticate],
    },
    async (request) => {
      const userId = request.user.id;
      const { menuItemId, quantity } = request.body as {
        menuItemId: number;
        quantity: number;
      };

      await upsertCartItem(fastify.db, userId, menuItemId, quantity);
      return { success: true };
    },
  );

  // DELETE /api/user/cart/:menuItemId — remove a single item
  fastify.delete(
    "/cart/:menuItemId",
    {
      schema: removeCartItemSchema,
      preHandler: [fastify.authenticate],
    },
    async (request) => {
      const userId = request.user.id;
      const { menuItemId } = request.params as { menuItemId: string };
      await removeCartItem(fastify.db, userId, parseInt(menuItemId));
      return { success: true };
    },
  );

  // DELETE /api/user/cart — clear the entire cart
  fastify.delete(
    "/cart",
    {
      schema: clearCartSchema,
      preHandler: [fastify.authenticate],
    },
    async (request) => {
      await clearCart(fastify.db, request.user.id);
      return { success: true };
    },
  );

  // POST /api/user/orders
  fastify.post(
    "/orders",
    {
      schema: checkoutSchema,
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      const userId = request.user.id;
      const { notes } = (request.body ?? {}) as { notes?: string };

      // Fetch saved address
      const address = await findAddressByUserId(fastify.db, userId);
      if (!address) {
        return reply.code(422 as any).send({
          error: "NoAddress",
          message: "Please save a delivery address before ordering",
        });
      }

      // Fetch user to get name and phone
      const userRecord = await findUserById(fastify.db, userId);
      if (!userRecord) {
        return reply
          .code(404 as any)
          .send({ error: "UserNotFound", message: "User not found" });
      }

      // Fetch cart
      const cartItemsList = await getCartItems(fastify.db, userId);
      if (cartItemsList.length === 0) {
        return reply.code(422 as any).send({
          error: "EmptyCart",
          message: "Your cart is empty",
        });
      }

      try {
        const order = await createOrder(fastify.db, {
          customerId: userId,
          customerName: userRecord.name,
          customerPhone: userRecord.phone ?? "",
          deliveryAddress: [
            address.address,
            address.landmark ? `Landmark: ${address.landmark}` : null,
            address.pincode,
          ]
            .filter(Boolean)
            .join(", "),
          notes: notes ?? null,
          totalAmount: "0", // recalculated inside placeOrder transaction
          items: cartItemsList.map((i) => ({
            menuItemId: i.menuItemId,
            quantity: i.quantity,
          })),
        });

        // Clear the cart after successful order
        await clearCart(fastify.db, userId);

        reply.code(201);
        return order;
      } catch (err: unknown) {
        const error = err as Error & { statusCode?: number };
        return reply.code((error.statusCode ?? 400) as any).send({
          error: "OrderFailed",
          message: error.message ?? "Failed to place order",
        });
      }
    },
  );
  // GET /api/user/orders — user's own order history
  fastify.get(
    "/orders",
    {
      preHandler: [fastify.authenticate],
    },
    async (request) => {
      const userId = request.user.id;
      return findOrdersByCustomerId(fastify.db, userId);
    },
  );
};

export default userRoutes;
