// POST /api/user/auth/signup

export const signupSchema = {
  body: {
    type: "object",
    properties: {
      phone: { type: "string", minLength: 7, maxLength: 20 },
      name: { type: "string", minLength: 1, maxLength: 100 },
    },
    required: ["phone", "name"],
    additionalProperties: false,
  },
  response: {
    201: {
      type: "object",
      properties: {
        accessToken: { type: "string" },
        refreshToken: { type: "string" },
        user: {
          type: "object",
          properties: {
            id: { type: "number" },
            name: { type: "string" },
            phone: { type: "string" },
          },
          required: ["id", "name", "phone"],
        },
      },
      required: ["accessToken", "refreshToken", "user"],
    },
  },
} as const;

// POST /api/user/auth/login

export const loginSchema = {
  body: {
    type: "object",
    properties: {
      phone: { type: "string", minLength: 7, maxLength: 20 },
    },
    required: ["phone"],
    additionalProperties: false,
  },
  response: {
    200: {
      type: "object",
      properties: {
        accessToken: { type: "string" },
        refreshToken: { type: "string" },
        user: {
          type: "object",
          properties: {
            id: { type: "number" },
            name: { type: "string" },
            phone: { type: "string" },
          },
          required: ["id", "name", "phone"],
        },
      },
      required: ["accessToken", "refreshToken", "user"],
    },
  },
} as const;

// POST /api/user/auth/refresh

export const userRefreshSchema = {
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

// POST /api/user/auth/logout

export const userLogoutSchema = {
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
