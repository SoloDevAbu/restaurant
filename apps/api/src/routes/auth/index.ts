import type { FastifyPluginAsync } from "fastify";
import { login, refresh, logout } from "../../services/auth.service";
import {
  loginSchema,
  refreshSchema,
  logoutSchema,
} from "../../schemas/auth.schema";

const authRoutes: FastifyPluginAsync = async (fastify) => {
  // POST /api/auth/login
  fastify.post("/login", { schema: loginSchema }, async (request, reply) => {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    try {
      const result = await login(fastify.db, fastify, email, password);
      return result;
    } catch (err: unknown) {
      const error = err as Error & { statusCode?: number };
      return reply
        .code((error.statusCode ?? 500) as any)
        .send({ error: error.message ?? "Login failed" });
    }
  });

  // POST /api/auth/refresh
  fastify.post(
    "/refresh",
    { schema: refreshSchema },
    async (request, reply) => {
      const { refreshToken } = request.body as { refreshToken: string };

      try {
        const result = await refresh(fastify.db, fastify, refreshToken);
        return result;
      } catch (err: unknown) {
        const error = err as Error & { statusCode?: number };
        return reply
          .code((error.statusCode ?? 500) as any)
          .send({ error: error.message ?? "Token refresh failed" });
      }
    },
  );

  // POST /api/auth/logout
  fastify.post("/logout", { schema: logoutSchema }, async (request, reply) => {
    const { refreshToken } = request.body as { refreshToken: string };
    await logout(fastify.db, refreshToken);
    return { success: true };
  });
};

export default authRoutes;
