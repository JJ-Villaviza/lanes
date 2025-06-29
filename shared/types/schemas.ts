import type {
  AccountTable,
  BranchTable,
  CompanyTable,
  SessionTable,
} from "@/database/schemas";
import type { InferSelectModel } from "drizzle-orm";

export type AccountType = InferSelectModel<typeof AccountTable>;
export type BranchType = InferSelectModel<typeof BranchTable>;
export type CompanyType = InferSelectModel<typeof CompanyTable>;
export type SessionType = InferSelectModel<typeof SessionTable>;
