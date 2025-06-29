import { relations } from "drizzle-orm";
import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { BranchTable } from ".";

export const SessionTable = pgTable("sessions", {
  token: uuid("token").notNull().defaultRandom(),
  branchId: uuid("branch_id").notNull(),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const SessionRelation = relations(SessionTable, ({ one }) => ({
  branch: one(BranchTable, {
    fields: [SessionTable.branchId],
    references: [BranchTable.id],
  }),
}));
