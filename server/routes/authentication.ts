import type { Context } from "@/context";
import { db } from "@/database";
import { AccountTable, BranchTable, SessionTable } from "@/database/schemas";
import { SessionMiddleware } from "@/middleware/session";
import { env } from "@/shared/env";
import type { SuccessResponse } from "@/shared/response";
import {
  loginSchema,
  registerSchema,
} from "@/shared/validations/authentication";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { DatabaseError } from "pg";

export const authenticationRoutes = new Hono<Context>()
  .basePath("/api/auth") // ? Base path for authentication routes

  // TODO: create route for login
  .post("/login", zValidator("form", loginSchema), async (c) => {
    const { username, password } = c.req.valid("form");

    const [existing] = await db
      .select()
      .from(BranchTable)
      .where(eq(BranchTable.username, username))
      .limit(1);
    if (!existing) {
      throw new HTTPException(401, {
        message: "Invalid credentials",
        cause: { form: true },
      });
    }

    const [account] = await db
      .select()
      .from(AccountTable)
      .where(eq(AccountTable.id, existing.accountId));

    const valid = await Bun.password.verify(password, account.password);
    if (!valid) {
      throw new HTTPException(401, {
        message: "Invalid credentials",
        cause: { form: true },
      });
    }

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

    const [cookie] = await db
      .insert(SessionTable)
      .values({ branchId: existing.id, expiresAt })
      .returning({ token: SessionTable.token });

    setCookie(c, env.SESSION_TOKEN, cookie.token);

    return c.json<
      SuccessResponse<{
        id: string;
        name: string;
        username: string;
        type: string;
        accountId: string;
        companyId: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
      }>
    >(
      {
        success: true,
        message: "Successfully login",
        data: { ...existing },
      },
      200
    );
  })

  // TODO: create route for register
  .post("/register", zValidator("form", registerSchema), async (c) => {
    const { name, username, password } = c.req.valid("form");
    const hash = await Bun.password.hash(password);
    const companyId = crypto.randomUUID();

    try {
      await db.transaction(async (tx) => {
        const [account] = await tx
          .insert(AccountTable)
          .values({ password: hash, companyId })
          .returning({
            id: AccountTable.id,
            companyId: AccountTable.companyId,
          });

        const [branch] = await tx
          .insert(BranchTable)
          .values({
            name,
            username,
            type: "administrator",
            accountId: account.id,
            companyId,
          })
          .returning();

        return {
          ...branch,
        };
      });

      return c.json<SuccessResponse>(
        {
          success: true,
          message: "Successfully registered",
        },
        201
      );
    } catch (error) {
      if (error instanceof DatabaseError && error.code === "23505") {
        throw new HTTPException(409, {
          message: "Username or email already exists",
          cause: { form: true },
        });
      }
      throw new HTTPException(500, { message: "Failed to create account" });
    }
  })

  // TODO: create route for sign-out
  .get("/sign-out", SessionMiddleware, async (c) => {
    const session = c.get("session")!;
    if (!session) {
      return c.redirect("/");
    }
    await db.delete(SessionTable).where(eq(SessionTable.token, session.token));
    deleteCookie(c, env.SESSION_TOKEN);
    return c.redirect("/");
  })
  .get("/", SessionMiddleware, async (c) => {
    const user = c.get("user")!;
    return c.json<
      SuccessResponse<{
        id: string;
        name: string;
        username: string;
        type: string;
        accountId: string;
        companyId: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
      }>
    >(
      {
        success: true,
        message: "Branch Details",
        data: { ...user },
      },
      200
    );
  });
