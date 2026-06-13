import type { FastifyPluginAsync } from "fastify";
import { getPublicMenu, getFeaturedItems } from "@repo/db/queries";

const menuRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /api/menu — active categories with available items grouped under each
  fastify.get("/", async () => {
    return getPublicMenu(fastify.db);
  });

  // GET /api/menu/featured — all featured+available items with category name
  fastify.get("/featured", async () => {
    return getFeaturedItems(fastify.db);
  });
};

export default menuRoutes;
