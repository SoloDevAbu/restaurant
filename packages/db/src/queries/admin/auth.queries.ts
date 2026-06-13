import { eq, gt } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type * as schema from "../../schema";
import { users, refreshTokens } from "../../schema";
import type { NewRefreshToken } from "../../index";

type DB = NodePgDatabase<typeof schema>;

// User lookup

export async function findUserByEmail(db: DB, email: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return result[0] ?? null;
}

export async function findUserById(db: DB, id: number) {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result[0] ?? null;
}

// Refresh tokens

export async function saveRefreshToken(
  db: DB,
  data: Omit<NewRefreshToken, "id" | "createdAt">,
) {
  const result = await db.insert(refreshTokens).values(data).returning();
  return result[0]!;
}

export async function findRefreshToken(db: DB, token: string) {
  const result = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.token, token))
    .limit(1);

  return result[0] ?? null;
}

export async function deleteRefreshToken(db: DB, token: string) {
  await db.delete(refreshTokens).where(eq(refreshTokens.token, token));
}

export async function deleteExpiredRefreshTokens(db: DB) {
  await db.delete(refreshTokens).where(gt(refreshTokens.expiresAt, new Date()));
}
