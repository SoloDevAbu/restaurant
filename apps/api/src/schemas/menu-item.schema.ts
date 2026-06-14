import { DIET_TYPES, FEATURED_TAGS } from "@repo/types";

// Reusable menu item object

export const menuItemSchema = {
  type: "object",
  properties: {
    id: { type: "number" },
    categoryId: { type: "number" },
    categoryName: { type: "string" },
    name: { type: "string" },
    description: { type: ["string", "null"] },
    price: { type: "string" },
    imageUrl: { type: ["string", "null"] },
    isAvailable: { type: "boolean" },
    isFeatured: { type: "boolean" },
    featuredTag: { type: ["string", "null"], enum: [...FEATURED_TAGS, null] },
    dietType: { type: ["string", "null"], enum: [...DIET_TYPES, null] },
    displayOrder: { type: "number" },
    createdAt: { type: "string" },
    updatedAt: { type: "string" },
  },
  required: [
    "id",
    "categoryId",
    "name",
    "price",
    "isAvailable",
    "isFeatured",
    "displayOrder",
    "createdAt",
    "updatedAt",
  ],
} as const;

// GET /api/admin/menu-items

export const getMenuItemsSchema = {
  querystring: {
    type: "object",
    properties: {
      categoryId: { type: "number" },
      isFeatured: { type: "boolean" },
      dietType: { type: "string", enum: DIET_TYPES },
      isAvailable: { type: "boolean" },
      page: { type: "number", default: 1, minimum: 1 },
      limit: { type: "number", default: 20, minimum: 1, maximum: 100 },
    },
    additionalProperties: false,
  },
  response: {
    200: {
      type: "object",
      properties: {
        data: { type: "array", items: menuItemSchema },
        total: { type: "number" },
        page: { type: "number" },
        limit: { type: "number" },
      },
      required: ["data", "total", "page", "limit"],
    },
  },
} as const;

// GET /api/admin/menu-items/:id

export const getMenuItemSchema = {
  params: {
    type: "object",
    properties: { id: { type: "number" } },
    required: ["id"],
  },
  response: {
    200: menuItemSchema,
  },
} as const;

// POST /api/admin/menu-items

export const createMenuItemSchema = {
  body: {
    type: "object",
    properties: {
      categoryId: { type: "number" },
      name: { type: "string", minLength: 1, maxLength: 150 },
      description: { type: "string" },
      price: { type: "string", pattern: "^\\d+(\\.\\d{1,2})?$" },
      imageUrl: { type: "string" },
      isAvailable: { type: "boolean", default: true },
      isFeatured: { type: "boolean", default: false },
      featuredTag: { type: "string", enum: FEATURED_TAGS },
      dietType: { type: "string", enum: DIET_TYPES },
      displayOrder: { type: "number", default: 0 },
    },
    required: ["categoryId", "name", "price"],
    additionalProperties: false,
  },
  response: {
    201: menuItemSchema,
  },
} as const;

// PATCH /api/admin/menu-items/:id

export const updateMenuItemSchema = {
  params: {
    type: "object",
    properties: { id: { type: "number" } },
    required: ["id"],
  },
  body: {
    type: "object",
    properties: {
      categoryId: { type: "number" },
      name: { type: "string", minLength: 1, maxLength: 150 },
      description: { type: ["string", "null"] },
      price: { type: "string", pattern: "^\\d+(\\.\\d{1,2})?$" },
      imageUrl: { type: ["string", "null"] },
      isAvailable: { type: "boolean" },
      isFeatured: { type: "boolean" },
      featuredTag: { type: ["string", "null"], enum: [...FEATURED_TAGS, null] },
      dietType: { type: ["string", "null"], enum: [...DIET_TYPES, null] },
      displayOrder: { type: "number" },
    },
    additionalProperties: false,
    minProperties: 1,
  },
  response: {
    200: menuItemSchema,
  },
} as const;

// PATCH /api/admin/menu-items/:id/availability

export const toggleAvailabilitySchema = {
  params: {
    type: "object",
    properties: { id: { type: "number" } },
    required: ["id"],
  },
  body: {
    type: "object",
    properties: {
      isAvailable: { type: "boolean" },
    },
    required: ["isAvailable"],
    additionalProperties: false,
  },
  response: {
    200: menuItemSchema,
  },
} as const;

// DELETE /api/admin/menu-items/:id

export const deleteMenuItemSchema = {
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
