import type { FastifyPluginAsync } from "fastify";
import { getDashboardStats } from "@repo/db/queries";
import { getDashboardSchema } from "../../schemas/dashboard.schema";

const dashboardRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /api/admin/dashboard
  fastify.get("/", { schema: getDashboardSchema }, async () => {
    return getDashboardStats(fastify.db);
  });
};

export default dashboardRoutes;
