import type { BranchType, SessionType } from "@/shared/types/schemas";
import type { Env } from "hono";

export interface Context extends Env {
  Variables: {
    user: BranchType | null;
    session: SessionType | null;
  };
}
