// Reusable category object

export const categorySchema = {
  type: "object",
  properties: {
    id: { type: "number" },
    name: { type: "string" },
    slug: { type: "string" },
    imageUrl: { type: ["string", "null"] },
    isActive: { type: "boolean" },
    displayOrder: { type: "number" },
    createdAt: { type: "string" },
  },
  required: ["id", "name", "slug", "isActive", "displayOrder", "createdAt"],
} as const;

// GET /api/admin/categories

export const getCategoriesSchema = {
  response: {
    200: {
      type: "object",
      properties: {
        data: { type: "array", items: categorySchema },
        total: { type: "number" },
      },
      required: ["data", "total"],
    },
  },
} as const;

// POST /api/admin/categories

export const createCategorySchema = {
  body: {
    type: "object",
    properties: {
      name: { type: "string", minLength: 1, maxLength: 100 },
      slug: { type: "string", maxLength: 100 },
      imageUrl: { type: "string" },
      displayOrder: { type: "number", default: 0 },
    },
    required: ["name"],
    additionalProperties: false,
  },
  response: {
    201: categorySchema,
  },
} as const;

// ─── PATCH /api/admin/categories/:id ─────────────────────────────────────────

export const updateCategorySchema = {
  params: {
    type: "object",
    properties: { id: { type: "number" } },
    required: ["id"],
  },
  body: {
    type: "object",
    properties: {
      name: { type: "string", minLength: 1, maxLength: 100 },
      slug: { type: "string", maxLength: 100 },
      imageUrl: { type: ["string", "null"] },
      isActive: { type: "boolean" },
      displayOrder: { type: "number" },
    },
    additionalProperties: false,
    minProperties: 1,
  },
  response: {
    200: categorySchema,
  },
} as const;

// ─── DELETE /api/admin/categories/:id ────────────────────────────────────────

export const deleteCategorySchema = {
  params: {
    type: "object",
    properties: { id: { type: "number" } },
    required: ["id"],
  },
  response: {
    200: {
      type: "object",
      properties: { success: { type: "boolean" } },
    },
  },
} as const;
