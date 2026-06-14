import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type * as schema from "../../schema";
import { users, userAddresses } from "../../schema";

type DB = NodePgDatabase<typeof schema>;

// ─── User lookup / creation ────────────────────────────────────────────────

/** Find a customer by phone number */
export async function findUserByPhone(db: DB, phone: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.phone, phone))
    .limit(1);

  return result[0] ?? null;
}

/** Create a phone-only customer account (no email, no password) */
export async function createCustomerUser(
  db: DB,
  data: { name: string; phone: string },
) {
  const result = await db
    .insert(users)
    .values({
      name: data.name,
      phone: data.phone,
      // Phone-only customers have no email/password; store empty placeholders
      // so the NOT NULL constraint is satisfied. The unique email constraint
      // is avoided by making the email the phone number prefixed.
      email: `phone_${data.phone}@noemail.local`,
      passwordHash: "",
      role: "customer",
      isActive: true,
    })
    .returning();

  return result[0]!;
}

// ─── Address ───────────────────────────────────────────────────────────────

export interface UpsertAddressData {
  name: string;
  phone: string;
  address: string;
  pincode: string;
  landmark?: string | null;
}

/** Upsert the single saved address for a user */
export async function upsertUserAddress(
  db: DB,
  userId: number,
  data: UpsertAddressData,
) {
  const result = await db
    .insert(userAddresses)
    .values({
      userId,
      name: data.name,
      phone: data.phone,
      address: data.address,
      pincode: data.pincode,
      landmark: data.landmark ?? null,
    })
    .onConflictDoUpdate({
      target: userAddresses.userId,
      set: {
        name: data.name,
        phone: data.phone,
        address: data.address,
        pincode: data.pincode,
        landmark: data.landmark ?? null,
        updatedAt: new Date(),
      },
    })
    .returning();

  return result[0]!;
}

/** Retrieve the saved address for a user (null if not set) */
export async function findAddressByUserId(db: DB, userId: number) {
  const result = await db
    .select()
    .from(userAddresses)
    .where(eq(userAddresses.userId, userId))
    .limit(1);

  return result[0] ?? null;
}
