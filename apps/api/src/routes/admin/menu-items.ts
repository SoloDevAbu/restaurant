import type { FastifyPluginAsync } from "fastify";
import {
  findAllMenuItems,
  findMenuItemById,
  createMenuItem,
  updateMenuItem,
  toggleMenuItemAvailability,
  deleteMenuItem,
} from "@repo/db/queries";
import {
  getMenuItemsSchema,
  getMenuItemSchema,
  createMenuItemSchema,
  updateMenuItemSchema,
  toggleAvailabilitySchema,
  deleteMenuItemSchema,
} from "../../schemas/menu-item.schema";

const menuItemsRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /api/admin/menu-items
  fastify.get("/", { schema: getMenuItemsSchema }, async (request) => {
    const query = request.query as {
      categoryId?: number;
      isFeatured?: boolean;
      dietType?: string;
      isAvailable?: boolean;
      page?: number;
      limit?: number;
    };

    return findAllMenuItems(
      fastify.db,
      {
        categoryId: query.categoryId,
        isFeatured: query.isFeatured,
        dietType: query.dietType,
        isAvailable: query.isAvailable,
      },
      { page: query.page ?? 1, limit: query.limit ?? 20 },
    );
  });

  // GET /api/admin/menu-items/:id
  fastify.get("/:id", { schema: getMenuItemSchema }, async (request, reply) => {
    const { id } = request.params as { id: number };
    const item = await findMenuItemById(fastify.db, id);
    if (!item) throw { statusCode: 404, message: "Menu item not found" };
    return item;
  });

  // POST /api/admin/menu-items
  fastify.post(
    "/",
    { schema: createMenuItemSchema },
    async (request, reply) => {
      const body = request.body as {
        categoryId: number;
        name: string;
        description?: string;
        price: string;
        imageUrl?: string;
        isAvailable?: boolean;
        isFeatured?: boolean;
        featuredTag?: string;
        dietType?: "veg" | "non_veg";
        displayOrder?: number;
      };

      const item = await createMenuItem(fastify.db, body);
      reply.code(201);
      return findMenuItemById(fastify.db, item.id);
    },
  );

  // PATCH /api/admin/menu-items/:id
  fastify.patch(
    "/:id",
    { schema: updateMenuItemSchema },
    async (request, reply) => {
      const { id } = request.params as { id: number };
      const body = request.body as Record<string, unknown>;

      const existing = await findMenuItemById(fastify.db, id);
      if (!existing)
        throw { statusCode: 404, message: "Menu item not found" };

      await updateMenuItem(fastify.db, id, body);
      return findMenuItemById(fastify.db, id);
    },
  );

  // PATCH /api/admin/menu-items/:id/availability
  fastify.patch(
    "/:id/availability",
    { schema: toggleAvailabilitySchema },
    async (request, reply) => {
      const { id } = request.params as { id: number };
      const { isAvailable } = request.body as { isAvailable: boolean };

      const existing = await findMenuItemById(fastify.db, id);
      if (!existing)
        throw { statusCode: 404, message: "Menu item not found" };

      await toggleMenuItemAvailability(fastify.db, id, isAvailable);
      return findMenuItemById(fastify.db, id);
    },
  );

  // DELETE /api/admin/menu-items/:id
  fastify.delete(
    "/:id",
    { schema: deleteMenuItemSchema },
    async (request, reply) => {
      const { id } = request.params as { id: number };

      const existing = await findMenuItemById(fastify.db, id);
      if (!existing)
        throw { statusCode: 404, message: "Menu item not found" };

      await deleteMenuItem(fastify.db, id);
      return { success: true };
    },
  );
};

export default menuItemsRoutes;
