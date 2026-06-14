// Reusable cart item shape (includes joined menu details)

const cartItemShape = {
  type: "object",
  properties: {
    id: { type: "number" },
    menuItemId: { type: "number" },
    quantity: { type: "number" },
    name: { type: "string" },
    price: { type: "string" },
    imageUrl: { type: ["string", "null"] },
    isAvailable: { type: "boolean" },
  },
  required: ["id", "menuItemId", "quantity", "name", "price", "isAvailable"],
} as const;

// GET /api/user/cart

export const getCartSchema = {
  response: {
    200: {
      type: "object",
      properties: {
        items: { type: "array", items: cartItemShape },
        total: { type: "string" },
        itemCount: { type: "number" },
      },
      required: ["items", "total", "itemCount"],
    },
  },
} as const;

// POST /api/user/cart — add / update item quantity

export const upsertCartItemSchema = {
  body: {
    type: "object",
    properties: {
      menuItemId: { type: "number" },
      quantity: { type: "number", minimum: 0 }, // 0 = remove
    },
    required: ["menuItemId", "quantity"],
    additionalProperties: false,
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
      },
    },
  },
} as const;

// DELETE /api/user/cart/:menuItemId — remove single item

export const removeCartItemSchema = {
  params: {
    type: "object",
    properties: {
      menuItemId: { type: "string" },
    },
    required: ["menuItemId"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
      },
    },
  },
} as const;

// DELETE /api/user/cart — clear entire cart

export const clearCartSchema = {
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
      },
    },
  },
} as const;

// POST /api/user/orders — checkout from cart

export const checkoutSchema = {
  body: {
    type: "object",
    properties: {
      notes: { type: "string", maxLength: 500 },
    },
    additionalProperties: false,
  },
  response: {
    201: {
      type: "object",
      properties: {
        id: { type: "string" },
        customerName: { type: "string" },
        customerPhone: { type: "string" },
        deliveryAddress: { type: "string" },
        notes: { type: ["string", "null"] },
        status: { type: "string" },
        totalAmount: { type: "string" },
        createdAt: { type: "string" },
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "number" },
              menuItemId: { type: "number" },
              itemName: { type: "string" },
              quantity: { type: "number" },
              unitPrice: { type: "string" },
            },
            required: ["id", "menuItemId", "itemName", "quantity", "unitPrice"],
          },
        },
      },
      required: ["id", "customerName", "customerPhone", "deliveryAddress", "status", "totalAmount", "createdAt"],
    },
  },
} as const;
