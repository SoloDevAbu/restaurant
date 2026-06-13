import type { FastifyPluginAsync } from "fastify";
import { sseRegistry } from "../services/sse-registry.js";

const sseRoutes: FastifyPluginAsync = async (fastify) => {
  /**
   * GET /api/sse/orders
   * Server-Sent Events stream for real-time order updates.
   * Admin dashboard connects here to receive:
   *   - new_order: when a customer places an order
   *   - order_status_changed: when admin updates an order status
   */
  fastify.get("/orders", async (request, reply) => {
    // SSE headers
    reply.raw.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // Disable Nginx buffering
    });

    reply.raw.write(": connected\n\n");

    const client = sseRegistry.add(reply);

    // Heartbeat every 30 seconds to prevent proxy timeouts
    const heartbeat = setInterval(() => {
      try {
        reply.raw.write(": ping\n\n");
      } catch {
        clearInterval(heartbeat);
        sseRegistry.remove(client);
      }
    }, 30_000);

    // Clean up when the client disconnects
    request.raw.on("close", () => {
      clearInterval(heartbeat);
      sseRegistry.remove(client);
      fastify.log.info(`SSE client disconnected. Active: ${sseRegistry.count}`);
    });

    await new Promise<void>((resolve) => {
      request.raw.on("close", resolve);
    });
  });
};

export default sseRoutes;
