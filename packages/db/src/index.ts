import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema.js";

export const db = drizzle(process.env.DATABASE_URL!, { schema });

export * from "./schema";

// Inferred row types
export type DB = typeof db;
export type OrderStatus = typeof schema.orders.$inferSelect.status;

export type User = typeof schema.users.$inferSelect;
export type NewUser = typeof schema.users.$inferInsert;

export type Category = typeof schema.categories.$inferSelect;
export type NewCategory = typeof schema.categories.$inferInsert;

export type MenuItem = typeof schema.menuItems.$inferSelect;
export type NewMenuItem = typeof schema.menuItems.$inferInsert;

export type Order = typeof schema.orders.$inferSelect;
export type NewOrder = typeof schema.orders.$inferInsert;

export type OrderItem = typeof schema.orderItems.$inferSelect;
export type NewOrderItem = typeof schema.orderItems.$inferInsert;

export type RefreshToken = typeof schema.refreshTokens.$inferSelect;
export type NewRefreshToken = typeof schema.refreshTokens.$inferInsert;

export type UserAddress = typeof schema.userAddresses.$inferSelect;
export type NewUserAddress = typeof schema.userAddresses.$inferInsert;

export type CartItem = typeof schema.cartItems.$inferSelect;
export type NewCartItem = typeof schema.cartItems.$inferInsert;
