import type { FastifyPluginAsync } from "fastify";
import {
  requestOtp,
  verifyOtpAndLogin,
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
} from "@repo/db/queries";
import { createOrder } from "../../services/order.service";
import {
  requestOtpSchema,
  verifyOtpSchema,
  userRefreshSchema,
  userLogoutSchema,
} from "../../schemas/user-auth.schema";
import { getAddressSchema, saveAddressSchema } from "../../schemas/address.schema";
import {
  getCartSchema,
  upsertCartItemSchema,
  removeCartItemSchema,
  clearCartSchema,
  checkoutSchema,
} from "../../schemas/cart.schema";

const userRoutes: FastifyPluginAsync = async (fastify) => {
  // ────────────────────────────────────────────────────────────────
  // AUTH
  // ────────────────────────────────────────────────────────────────

  // POST /api/user/auth/request-otp
  fastify.post(
    "/auth/request-otp",
    { schema: requestOtpSchema },
    async (request) => {
      const { phone } = request.body as { phone: string };
      await requestOtp(fastify.db, phone);
      return { message: "OTP sent" };
    },
  );

  // POST /api/user/auth/verify-otp
  fastify.post(
    "/auth/verify-otp",
    { schema: verifyOtpSchema },
    async (request, reply) => {
      const { phone, otp, name } = request.body as {
        phone: string;
        otp: string;
        name?: string;
      };

      try {
        const result = await verifyOtpAndLogin(
          fastify.db,
          fastify,
          phone,
          otp,
          name,
        );
        return result;
      } catch (err: unknown) {
        const error = err as Error & { statusCode?: number };
        return reply
          .code((error.statusCode ?? 500) as any)
          .send({ error: error.message ?? "OTP verification failed" });
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
        name: string;
        phone: string;
        address: string;
        pincode: string;
        landmark?: string;
      };

      return upsertUserAddress(fastify.db, userId, {
        name: body.name,
        phone: body.phone,
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

  // ────────────────────────────────────────────────────────────────
  // ORDERS — checkout from cart  (requires auth)
  // ────────────────────────────────────────────────────────────────

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
          customerName: address.name,
          customerPhone: address.phone,
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
