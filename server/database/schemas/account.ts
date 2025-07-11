import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { BranchTable } from ".";

export const AccountTable = pgTable("accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  password: text("password").notNull(),

  companyId: uuid("company_id").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
  deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" }),
});

export const AccountRelation = relations(AccountTable, ({ one }) => ({
  branch: one(BranchTable, {
    fields: [AccountTable.id],
    references: [BranchTable.accountId],
  }),
}));
