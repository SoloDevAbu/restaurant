// Reusable definitions

const authUserSchema = {
  type: "object",
  properties: {
    id: { type: "number" },
    name: { type: "string" },
    email: { type: "string" },
    role: { type: "string", enum: ["admin", "delivery", "customer"] },
  },
  required: ["id", "name", "email", "role"],
} as const;

// POST /api/auth/login

export const loginSchema = {
  body: {
    type: "object",
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 6 },
    },
    required: ["email", "password"],
    additionalProperties: false,
  },
  response: {
    200: {
      type: "object",
      properties: {
        accessToken: { type: "string" },
        refreshToken: { type: "string" },
        user: authUserSchema,
      },
      required: ["accessToken", "refreshToken", "user"],
    },
  },
} as const;

// POST /api/auth/refresh

export const refreshSchema = {
  body: {
    type: "object",
    properties: {
      refreshToken: { type: "string" },
    },
    required: ["refreshToken"],
    additionalProperties: false,
  },
  response: {
    200: {
      type: "object",
      properties: {
        accessToken: { type: "string" },
        refreshToken: { type: "string" },
      },
      required: ["accessToken", "refreshToken"],
    },
  },
} as const;

// POST /api/auth/logout

export const logoutSchema = {
  body: {
    type: "object",
    properties: {
      refreshToken: { type: "string" },
    },
    required: ["refreshToken"],
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
