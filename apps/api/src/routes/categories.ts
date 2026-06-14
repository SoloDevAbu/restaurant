import type { FastifyPluginAsync } from "fastify";
import { getPublicCategories } from "@repo/db/queries";

const categoriesRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /api/categories — active categories
  fastify.get("/", async () => {
    return getPublicCategories(fastify.db);
  });
};

export default categoriesRoutes;
