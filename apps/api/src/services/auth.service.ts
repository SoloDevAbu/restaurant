import { hash, verify } from "@node-rs/argon2";
import { randomBytes } from "node:crypto";
import type { FastifyInstance } from "fastify";
import {
  findUserByEmail,
  findUserById,
  saveRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
} from "@repo/db/queries";
import type { DB } from "@repo/db";

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Login

export async function login(
  db: DB,
  app: FastifyInstance,
  email: string,
  password: string,
) {
  const user = await findUserByEmail(db, email);

  if (!user || !user.isActive) {
    throw { statusCode: 401, message: "Invalid email or password" };
  }

  const valid = await verify(user.passwordHash, password);
  if (!valid) {
    throw { statusCode: 401, message: "Invalid email or password" };
  }

  const accessToken = app.jwt.sign({
    id: user.id,
    email: user.email,
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
      email: user.email,
      role: user.role,
    },
  };
}

// Refresh

export async function refresh(db: DB, app: FastifyInstance, token: string) {
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

  // Rotate: delete old, issue new
  await deleteRefreshToken(db, token);

  const accessToken = app.jwt.sign({
    id: user.id,
    email: user.email,
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

// Logout

export async function logout(db: DB, token: string) {
  await deleteRefreshToken(db, token);
}

// Password hashing

export async function hashPassword(password: string): Promise<string> {
  return hash(password, {
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });
}
