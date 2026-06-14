import type { FastifyPluginAsync } from "fastify";
import { getPublicMenu, getFeaturedItems, getMenuItemsFiltered } from "@repo/db/queries";

const menuRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /api/menu — active categories with available items grouped under each
  fastify.get("/", async () => {
    return getPublicMenu(fastify.db);
  });

  // GET /api/menu/featured — all featured+available items with category name
  fastify.get("/featured", async () => {
    return getFeaturedItems(fastify.db);
  });

  // GET /api/menu/items — filter items by category or diet type
  fastify.get<{
    Querystring: {
      categoryId?: string;
      dietType?: string;
      search?: string;
    };
  }>("/items", async (request) => {
    const filters = {
      categoryId: request.query.categoryId ? parseInt(request.query.categoryId) : undefined,
      dietType: request.query.dietType,
      search: request.query.search,
    };
    return getMenuItemsFiltered(fastify.db, filters);
  });
};

export default menuRoutes;
