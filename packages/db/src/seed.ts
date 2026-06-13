import "dotenv/config";
import { db, users } from "./index.js";
import { hash } from "@node-rs/argon2";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("Seeding database...");

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@restaurant.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@123";
  const adminName = process.env.ADMIN_NAME ?? "Restaurant Admin";

  // Check if admin already exists
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, adminEmail))
    .limit(1);

  if (existing.length > 0) {
    console.log(`Admin already exists: ${adminEmail}`);
    process.exit(0);
  }

  const passwordHash = await hash(adminPassword, {
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });

  await db.insert(users).values({
    name: adminName,
    email: adminEmail,
    passwordHash,
    role: "admin",
    isActive: true,
  });

  console.log(`Admin created: ${adminEmail}`);
  console.log(`Password: ${adminPassword}`);
  console.log("Change this password in production!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
