// POST /api/user/auth/request-otp

export const requestOtpSchema = {
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
        message: { type: "string" },
      },
      required: ["message"],
    },
  },
} as const;

// POST /api/user/auth/verify-otp

export const verifyOtpSchema = {
  body: {
    type: "object",
    properties: {
      phone: { type: "string", minLength: 7, maxLength: 20 },
      otp: { type: "string", minLength: 4, maxLength: 8 },
      name: { type: "string", minLength: 1, maxLength: 100 },
    },
    required: ["phone", "otp"],
    additionalProperties: false,
  },
  response: {
    200: {
      type: "object",
      properties: {
        accessToken: { type: "string" },
        refreshToken: { type: "string" },
        isNewUser: { type: "boolean" },
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
      required: ["accessToken", "refreshToken", "isNewUser", "user"],
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
