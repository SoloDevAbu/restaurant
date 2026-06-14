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
import { generateOtp, verifyOtp } from "./otp.service";
import type { DB } from "@repo/db";

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// ─── Step 1: Request OTP ───────────────────────────────────────────────────

/**
 * Generate and "send" (log) an OTP for the given phone number.
 * Returns the generated code so tests/tooling can assert on it.
 */
export async function requestOtp(_db: DB, phone: string): Promise<void> {
  generateOtp(phone);
}

// ─── Step 2: Verify OTP + issue tokens ────────────────────────────────────

export interface VerifyOtpResult {
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean;
  user: {
    id: number;
    name: string;
    phone: string;
  };
}

/**
 * Verify the OTP and return JWT tokens.
 * If no user exists for the phone, create one (requires `name`).
 */
export async function verifyOtpAndLogin(
  db: DB,
  app: FastifyInstance,
  phone: string,
  otp: string,
  name?: string,
): Promise<VerifyOtpResult> {
  let user = await findUserByPhone(db, phone);
  let isNewUser = false;

  if (!user) {
    if (!name || name.trim().length === 0) {
      // 2-step signup: verify OTP but keep it in the store
      if (!verifyOtp(phone, otp, true)) {
        throw { statusCode: 401, message: "Invalid or expired OTP" };
      }
      // Return a special flag so the UI knows to ask for the name
      return {
        accessToken: "",
        refreshToken: "",
        isNewUser: true,
        user: { id: 0, name: "", phone },
      };
    }

    // Now they provided a name, consume OTP
    if (!verifyOtp(phone, otp, false)) {
      throw { statusCode: 401, message: "Invalid or expired OTP" };
    }
    user = await createCustomerUser(db, { name: name.trim(), phone });
    isNewUser = true;
  } else {
    // Existing user, consume OTP
    if (!verifyOtp(phone, otp, false)) {
      throw { statusCode: 401, message: "Invalid or expired OTP" };
    }
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
    isNewUser,
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
