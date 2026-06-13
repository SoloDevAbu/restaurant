import type { FastifyPluginAsync } from "fastify";
import {
  findAllCategories,
  findCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  countMenuItemsByCategory,
} from "@repo/db/queries";
import {
  getCategoriesSchema,
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
} from "../../schemas/category.schema";

const categoriesRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /api/admin/categories
  fastify.get("/", { schema: getCategoriesSchema }, async () => {
    const data = await findAllCategories(fastify.db);
    return { data, total: data.length };
  });

  // POST /api/admin/categories
  fastify.post(
    "/",
    { schema: createCategorySchema },
    async (request, reply) => {
      const body = request.body as {
        name: string;
        slug?: string;
        imageUrl?: string;
        displayOrder?: number;
      };

      const category = await createCategory(fastify.db, body);
      reply.code(201);
      return category;
    },
  );

  // PATCH /api/admin/categories/:id
  fastify.patch(
    "/:id",
    { schema: updateCategorySchema },
    async (request, reply) => {
      const { id } = request.params as { id: number };
      const body = request.body as {
        name?: string;
        slug?: string;
        imageUrl?: string | null;
        isActive?: boolean;
        displayOrder?: number;
      };

      const existing = await findCategoryById(fastify.db, id);
      if (!existing) {
        throw { statusCode: 404, message: "Category not found" };
      }

      const updated = await updateCategory(fastify.db, id, body);
      return updated;
    },
  );

  // DELETE /api/admin/categories/:id
  fastify.delete(
    "/:id",
    { schema: deleteCategorySchema },
    async (request, reply) => {
      const { id } = request.params as { id: number };

      const existing = await findCategoryById(fastify.db, id);
      if (!existing) {
        throw { statusCode: 404, message: "Category not found" };
      }

      const itemCount = await countMenuItemsByCategory(fastify.db, id);
      if (itemCount > 0) {
        // Soft-delete: mark as inactive instead of hard delete
        await updateCategory(fastify.db, id, { isActive: false });
        return { success: true };
      }

      await deleteCategory(fastify.db, id);
      return { success: true };
    },
  );
};

export default categoriesRoutes;
