import { ORDER_STATUSES } from "@repo/types";

// Reusable order item shape

const orderItemSchema = {
  type: "object",
  properties: {
    id: { type: "number" },
    menuItemId: { type: "number" },
    itemName: { type: "string" },
    quantity: { type: "number" },
    unitPrice: { type: "string" },
  },
  required: ["id", "menuItemId", "itemName", "quantity", "unitPrice"],
} as const;

// Reusable order shape

export const orderSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    customerId: { type: ["number", "null"] },
    customerName: { type: "string" },
    customerPhone: { type: "string" },
    deliveryAddress: { type: "string" },
    notes: { type: ["string", "null"] },
    status: { type: "string", enum: ORDER_STATUSES },
    totalAmount: { type: "string" },
    deliveryManId: { type: ["number", "null"] },
    estimatedMinutes: { type: ["number", "null"] },
    createdAt: { type: "string" },
    updatedAt: { type: "string" },
    items: { type: "array", items: orderItemSchema },
  },
  required: [
    "id",
    "customerName",
    "customerPhone",
    "deliveryAddress",
    "status",
    "totalAmount",
    "createdAt",
    "updatedAt",
  ],
} as const;

// GET /api/admin/orders

export const getOrdersSchema = {
  querystring: {
    type: "object",
    properties: {
      page: { type: "number", default: 1, minimum: 1 },
      limit: { type: "number", default: 20, minimum: 1, maximum: 100 },
      status: { type: "string", enum: ORDER_STATUSES },
      date: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
      search: { type: "string" },
    },
    additionalProperties: false,
  },
  response: {
    200: {
      type: "object",
      properties: {
        data: { type: "array", items: orderSchema },
        total: { type: "number" },
        page: { type: "number" },
        limit: { type: "number" },
      },
      required: ["data", "total", "page", "limit"],
    },
  },
} as const;

// GET /api/admin/orders/:id

export const getOrderSchema = {
  params: {
    type: "object",
    properties: { id: { type: "string", format: "uuid" } },
    required: ["id"],
  },
  response: {
    200: orderSchema,
  },
} as const;

// PATCH /api/admin/orders/:id/status

export const updateOrderStatusSchema = {
  params: {
    type: "object",
    properties: { id: { type: "string", format: "uuid" } },
    required: ["id"],
  },
  body: {
    type: "object",
    properties: {
      status: { type: "string", enum: ORDER_STATUSES },
      deliveryManId: { type: "number" },
      estimatedMinutes: { type: "number", minimum: 1 },
    },
    required: ["status"],
    additionalProperties: false,
  },
  response: {
    200: orderSchema,
  },
} as const;

// POST /api/orders (customer place order)

const placeOrderItemSchema = {
  type: "object",
  properties: {
    menuItemId: { type: "number" },
    quantity: { type: "number", minimum: 1 },
  },
  required: ["menuItemId", "quantity"],
} as const;

export const placeOrderSchema = {
  body: {
    type: "object",
    properties: {
      customerName: { type: "string", minLength: 1, maxLength: 150 },
      customerPhone: { type: "string", minLength: 7, maxLength: 20 },
      deliveryAddress: { type: "string", minLength: 5 },
      notes: { type: "string" },
      items: {
        type: "array",
        items: placeOrderItemSchema,
        minItems: 1,
      },
    },
    required: ["customerName", "customerPhone", "deliveryAddress", "items"],
    additionalProperties: false,
  },
  response: {
    201: orderSchema,
  },
} as const;
