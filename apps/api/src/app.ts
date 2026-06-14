import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import dbPlugin from "./plugins/db";
import jwtPlugin from "./plugins/jwt";
import authRoutes from "./routes/auth/index";
import adminRoutes from "./routes/admin/index";
import menuRoutes from "./routes/menu";
import categoriesRoutes from "./routes/categories";
import ordersRoutes from "./routes/orders";
import sseRoutes from "./routes/sse";
import type { FastifyError } from "fastify";

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL ?? "info",
    },
  });

  // CORS
  await app.register(cors, {
    origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
    credentials: true,
  });

  // Rate limiting
  await app.register(rateLimit, {
    max: 200,
    timeWindow: "1 minute",
  });

  // Core plugins
  await app.register(dbPlugin);
  await app.register(jwtPlugin);

  // Routes
  await app.register(authRoutes, { prefix: "/api/auth" });
  await app.register(adminRoutes, { prefix: "/api/admin" });
  await app.register(menuRoutes, { prefix: "/api/menu" });
  await app.register(categoriesRoutes, { prefix: "/api/categories" });
  await app.register(ordersRoutes, { prefix: "/api/orders" });
  await app.register(sseRoutes, { prefix: "/api/sse" });

  // Health check
  app.get("/health", async () => ({
    status: "ok",
    timestamp: new Date().toISOString(),
  }));

  // Global error handler
  app.setErrorHandler((error: FastifyError, _request, reply) => {
    app.log.error(error);

    const statusCode = error.statusCode ?? 500;
    reply.code(statusCode).send({
      error: error.name ?? "InternalServerError",
      message: error.message,
      ...(process.env.NODE_ENV !== "production" && { stack: error.stack }),
    });
  });

  // 404 handler
  app.setNotFoundHandler((_request, reply) => {
    reply.code(404).send({
      error: "NotFound",
      message: `Route ${_request.method} ${_request.url} not found`,
    });
  });

  return app;
}
