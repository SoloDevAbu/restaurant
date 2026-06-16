import { randomBytes } from "node:crypto";
import type { FastifyInstance } from "fastify";
import {
  findUserByPhone,
  findUserById,
  createCustomerUser,
  saveRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
} from "@repo/db/queries";
import type { DB } from "@repo/db";

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    name: string;
    phone: string;
  };
}

/**
 * Sign up a new user. Throws if phone is already registered.
 */
export async function signupUser(
  db: DB,
  app: FastifyInstance,
  name: string,
  phone: string,
): Promise<AuthResult> {
  const existingUser = await findUserByPhone(db, phone);
  if (existingUser) {
    throw { statusCode: 409, message: "User already exists with this phone number" };
  }

  const user = await createCustomerUser(db, { name: name.trim(), phone });

  const accessToken = app.jwt.sign({
    id: user.id,
    email: user.email ?? "",
    role: user.role,
    name: user.name,
  });

  const refreshTokenValue = randomBytes(40).toString("hex");
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

  await saveRefreshToken(db, {
    userId: user.id,
    token: refreshTokenValue,
    expiresAt,
  });

  return {
    accessToken,
    refreshToken: refreshTokenValue,
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone ?? phone,
    },
  };
}

/**
 * Log in an existing user. Throws if user not found.
 */
export async function loginUser(
  db: DB,
  app: FastifyInstance,
  phone: string,
): Promise<AuthResult> {
  const user = await findUserByPhone(db, phone);
  
  if (!user) {
    throw { statusCode: 404, message: "User not found. Please sign up." };
  }

  if (!user.isActive) {
    throw { statusCode: 403, message: "Account is deactivated" };
  }

  const accessToken = app.jwt.sign({
    id: user.id,
    email: user.email ?? "",
    role: user.role,
    name: user.name,
  });

  const refreshTokenValue = randomBytes(40).toString("hex");
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

  await saveRefreshToken(db, {
    userId: user.id,
    token: refreshTokenValue,
    expiresAt,
  });

  return {
    accessToken,
    refreshToken: refreshTokenValue,
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone ?? phone,
    },
  };
}

// ─── Refresh ───────────────────────────────────────────────────────────────

export async function refreshUserToken(
  db: DB,
  app: FastifyInstance,
  token: string,
) {
  const stored = await findRefreshToken(db, token);

  if (!stored || stored.expiresAt < new Date()) {
    await deleteRefreshToken(db, token);
    throw { statusCode: 401, message: "Invalid or expired refresh token" };
  }

  const user = await findUserById(db, stored.userId);

  if (!user || !user.isActive) {
    await deleteRefreshToken(db, token);
    throw { statusCode: 401, message: "User not found or deactivated" };
  }

  await deleteRefreshToken(db, token);

  const accessToken = app.jwt.sign({
    id: user.id,
    email: user.email ?? "",
    role: user.role,
    name: user.name,
  });

  const newRefreshToken = randomBytes(40).toString("hex");
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

  await saveRefreshToken(db, {
    userId: user.id,
    token: newRefreshToken,
    expiresAt,
  });

  return { accessToken, refreshToken: newRefreshToken };
}

// ─── Logout ────────────────────────────────────────────────────────────────

export async function logoutUser(db: DB, token: string) {
  await deleteRefreshToken(db, token);
}
