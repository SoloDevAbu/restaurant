import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";
import { db } from "@repo/db";
import type { DB } from "@repo/db";

// Type augmentation
declare module "fastify" {
  interface FastifyInstance {
    db: DB;
  }
}

// Plugin
export default fp(
  async function dbPlugin(fastify: FastifyInstance) {
    fastify.decorate("db", db);

    fastify.log.info("Database plugin registered");
  },
  { name: "db-plugin" },
);
