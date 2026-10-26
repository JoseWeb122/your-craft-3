import {
  integer,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const newsletterSignups = pgTable("newsletter_signups", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/** Demo-only orders captured from the prototype checkout. No payment is taken. */
export const demoOrders = pgTable("demo_orders", {
  id: serial("id").primaryKey(),
  reference: text("reference").notNull().unique(),
  customerName: text("customer_name").notNull(),
  email: text("email").notNull(),
  address: text("address").notNull(),
  items: jsonb("items").notNull(),
  itemCount: integer("item_count").notNull(),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
