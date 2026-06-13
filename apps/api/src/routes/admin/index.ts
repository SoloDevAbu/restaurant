import type { FastifyPluginAsync } from "fastify";
import dashboardRoutes from "./dashboard";
import categoriesRoutes from "./categories";
import menuItemsRoutes from "./menu-items.js";
import ordersRoutes from "./orders.js";

/**
 * Admin route group — all routes under /api/admin
 * Protected by the authorizeAdmin hook applied at the plugin level.
 */
const adminRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("onRequest", fastify.authorizeAdmin);

  await fastify.register(dashboardRoutes, { prefix: "/dashboard" });
  await fastify.register(categoriesRoutes, { prefix: "/categories" });
  await fastify.register(menuItemsRoutes, { prefix: "/menu-items" });
  await fastify.register(ordersRoutes, { prefix: "/orders" });
};

export default adminRoutes;
