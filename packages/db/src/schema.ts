import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  numeric,
  boolean,
  pgEnum,
  uuid,
} from "drizzle-orm/pg-core";

// Enums

export const userRoleEnum = pgEnum("user_role", [
  "admin",
  "delivery",
  "customer",
]);

export const dietTypeEnum = pgEnum("diet_type", ["veg", "non_veg"]);

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
]);

// Users

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("customer"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Refresh Tokens

export const refreshTokens = pgTable("refresh_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Categories

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true).notNull(),
  displayOrder: integer("display_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Menu Items

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id),
  name: varchar("name", { length: 150 }).notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url"),
  isAvailable: boolean("is_available").default(true).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  /** e.g. 'must_try' | 'main_course' | 'combo' | 'dessert' | 'drink' */
  featuredTag: varchar("featured_tag", { length: 50 }),
  dietType: dietTypeEnum("diet_type"),
  displayOrder: integer("display_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Orders

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: integer("customer_id").references(() => users.id),
  customerName: varchar("customer_name", { length: 150 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 20 }).notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  notes: text("notes"),
  status: orderStatusEnum("status").default("pending").notNull(),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  deliveryManId: integer("delivery_man_id").references(() => users.id),
  estimatedMinutes: integer("estimated_minutes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Order Items

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  menuItemId: integer("menu_item_id")
    .notNull()
    .references(() => menuItems.id),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  itemName: varchar("item_name", { length: 150 }).notNull(),
});
