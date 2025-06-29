import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { AccountTable, CompanyTable } from ".";
import { SessionTable } from "./session";

export const BranchType = pgEnum("branch_type", ["branch", "administrator"]);

export const BranchTable = pgTable("branches", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  username: text("username").notNull(),
  type: BranchType().notNull(),

  accountId: uuid("account_id").notNull(),
  companyId: uuid("company_id").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const BranchRelation = relations(BranchTable, ({ one }) => ({
  account: one(AccountTable, {
    fields: [BranchTable.accountId],
    references: [AccountTable.id],
  }),
  company: one(CompanyTable, {
    fields: [BranchTable.companyId],
    references: [CompanyTable.id],
  }),
  session: one(SessionTable, {
    fields: [BranchTable.id],
    references: [SessionTable.branchId],
  }),
}));
