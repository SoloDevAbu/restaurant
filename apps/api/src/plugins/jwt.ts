import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { JwtPayload } from "@repo/types";

// Type augmentation
declare module "fastify" {
  interface FastifyInstance {
    /** Verify any valid JWT — attaches payload to request.user */
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
    /** Verify JWT AND ensure role === 'admin' */
    authorizeAdmin: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: JwtPayload;
    user: JwtPayload;
  }
}

// Plugin
export default fp(
  async function jwtPlugin(fastify: FastifyInstance) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET environment variable is required");
    }

    await fastify.register(fastifyJwt, {
      secret,
      sign: {
        expiresIn: "15m",
      },
    });

    fastify.decorate(
      "authenticate",
      async function (request: FastifyRequest, reply: FastifyReply) {
        try {
          await request.jwtVerify();
        } catch {
          reply.code(401).send({
            error: "Unauthorized",
            message: "Invalid or expired token",
          });
        }
      },
    );

    // Admin-only guard
    fastify.decorate(
      "authorizeAdmin",
      async function (request: FastifyRequest, reply: FastifyReply) {
        try {
          await request.jwtVerify();
          if (request.user.role !== "admin") {
            return reply.code(403).send({
              error: "Forbidden",
              message: "Admin access required",
            });
          }
        } catch {
          reply.code(401).send({
            error: "Unauthorized",
            message: "Invalid or expired token",
          });
        }
      },
    );
  },
  { name: "jwt-plugin" },
);
