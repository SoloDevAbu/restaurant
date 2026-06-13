import type { FastifyReply } from "fastify";

interface SseClient {
  reply: FastifyReply;
}

// In-memory SSE client registry
const clients = new Set<SseClient>();

export const sseRegistry = {
  add(reply: FastifyReply) {
    const client: SseClient = { reply };
    clients.add(client);
    return client;
  },

  remove(client: SseClient) {
    clients.delete(client);
  },

  broadcast(event: string, data: unknown) {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const client of clients) {
      try {
        client.reply.raw.write(payload);
      } catch {
        // Client disconnected — remove stale entry
        clients.delete(client);
      }
    }
  },

  get count() {
    return clients.size;
  },
};
