// Reusable address shape

const addressShape = {
  type: "object",
  properties: {
    id: { type: "number" },
    userId: { type: "number" },
    name: { type: "string" },
    phone: { type: "string" },
    address: { type: "string" },
    pincode: { type: "string" },
    landmark: { type: ["string", "null"] },
    createdAt: { type: "string" },
    updatedAt: { type: "string" },
  },
  required: ["id", "userId", "name", "phone", "address", "pincode", "createdAt", "updatedAt"],
} as const;

// GET /api/user/address

export const getAddressSchema = {
  response: {
    200: addressShape,
    404: {
      type: "object",
      properties: { error: { type: "string" }, message: { type: "string" } },
    },
  },
} as const;

// PUT /api/user/address

export const saveAddressSchema = {
  body: {
    type: "object",
    properties: {
      name: { type: "string", minLength: 1, maxLength: 100 },
      phone: { type: "string", minLength: 7, maxLength: 20 },
      address: { type: "string", minLength: 5 },
      pincode: { type: "string", minLength: 4, maxLength: 10 },
      landmark: { type: "string", maxLength: 150 },
    },
    required: ["name", "phone", "address", "pincode"],
    additionalProperties: false,
  },
  response: {
    200: addressShape,
  },
} as const;
