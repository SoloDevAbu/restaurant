import { orderSchema } from "./order.schema.js";

export const getDashboardSchema = {
  response: {
    200: {
      type: "object",
      properties: {
        todayOrders:     { type: "number" },
        todayRevenue:    { type: "string" },
        pendingOrders:   { type: "number" },
        activeMenuItems: { type: "number" },
        recentOrders: {
          type: "array",
          items: orderSchema,
        },
      },
      required: [
        "todayOrders", "todayRevenue", "pendingOrders",
        "activeMenuItems", "recentOrders",
      ],
    },
  },
} as const;
