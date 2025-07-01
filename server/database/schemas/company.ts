import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { BranchTable } from ".";

export const CompanyTable = pgTable("companies", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessName: text("business_name").notNull().unique(),
  email: text("email").notNull().unique(),
  description: text("description"),
  mission: text("mission"),
  vision: text("vision"),

  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
  deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" }),
});

export const CompanyRelation = relations(CompanyTable, ({ many }) => ({
  branches: many(BranchTable),
}));
