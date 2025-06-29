import type { Context } from "@/context";
import { db } from "@/database";
import { BranchTable, SessionTable } from "@/database/schemas";
import { env } from "@/shared/env";
import { eq } from "drizzle-orm";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

export const SessionMiddleware = createMiddleware<Context>(async (c, next) => {
  const token = getCookie(c, env.SESSION_TOKEN);
  if (!token) {
    c.set("session", null);
    c.set("user", null);
    throw new HTTPException(401, {
      message: "Unauthorized, token not found",
    });
  }

  const [session] = await db
    .select()
    .from(SessionTable)
    .where(eq(SessionTable.token, token))
    .limit(1);
  if (!session) {
    c.set("session", null);
    c.set("user", null);
    deleteCookie(c, env.SESSION_TOKEN);
    throw new HTTPException(401, {
      message: "Unauthorized, session not found",
    });
  }

  const [branch] = await db
    .select()
    .from(BranchTable)
    .where(eq(BranchTable.id, session.branchId))
    .limit(1);
  if (!branch) {
    c.set("session", null);
    c.set("user", null);
    await db.delete(SessionTable).where(eq(SessionTable.token, session.token));
    deleteCookie(c, env.SESSION_TOKEN);
    throw new HTTPException(401, {
      message: "Unauthorized, Account not found",
    });
  }

  const expiresAt = new Date(session.expiresAt);
  if (expiresAt < new Date()) {
    c.set("session", null);
    c.set("user", null);
    await db.delete(SessionTable).where(eq(SessionTable.token, session.token));
    throw new HTTPException(401, {
      message: "Unauthorized, session expired",
    });
  }

  const newToken = crypto.randomUUID();
  const extendedExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

  const [newSession] = await db
    .update(SessionTable)
    .set({ token: newToken, expiresAt: extendedExpiresAt })
    .where(eq(SessionTable.branchId, session.branchId))
    .returning();

  setCookie(c, env.SESSION_TOKEN, newToken);

  c.set("session", newSession);
  c.set("user", branch);
  await next();
});
