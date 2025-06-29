import type { Context } from "@/context";
import { db } from "@/database";
import { AccountTable, BranchTable } from "@/database/schemas";
import { AdministratorMiddleware } from "@/middleware/administrator";
import { SessionMiddleware } from "@/middleware/session";
import type { SuccessResponse } from "@/shared/response";
import type { BranchType } from "@/shared/types/schemas";
import {
  branchAddSchema,
  branchPasswordUpdateSchema,
  branchUpdateSchema,
} from "@/shared/validations/branch";
import { IdSchema } from "@/shared/validations/id";
import { zValidator } from "@hono/zod-validator";
import { and, eq, ne } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { DatabaseError } from "pg";

export const branchRoutes = new Hono<Context>()
  .basePath("/api/branch")
  .post(
    "/",
    zValidator("form", branchAddSchema),
    AdministratorMiddleware,
    SessionMiddleware,
    async (c) => {
      const { name, username, password } = c.req.valid("form");
      const hash = await Bun.password.hash(password);
      const user = c.get("user")!;

      try {
        const transaction = await db.transaction(async (tx) => {
          const [account] = await tx
            .insert(AccountTable)
            .values({ password: hash })
            .returning({ id: AccountTable.id });

          const [branch] = await tx
            .insert(BranchTable)
            .values({
              name,
              username,
              type: "branch",
              accountId: account.id,
              companyId: user.companyId,
            })
            .returning();

          return { ...branch };
        });

        return c.json<SuccessResponse<BranchType>>(
          {
            success: true,
            message: "Successfully created branch",
            data: { ...transaction },
          },
          201
        );
      } catch (error) {
        if (error instanceof DatabaseError && error.code === "23505") {
          throw new HTTPException(409, {
            message: "Branch already exists",
            cause: { form: true },
          });
        }
        throw new HTTPException(500, {
          message: "Failed to create branch",
          cause: { form: true },
        });
      }
    }
  )
  .get("/", zValidator("query", IdSchema), async (c) => {
    const { id } = c.req.valid("query");

    const [branch] = await db
      .select()
      .from(BranchTable)
      .where(eq(BranchTable.id, id));
    if (!branch) {
      throw new HTTPException(404, {
        message: "Branch not found",
      });
    }

    return c.json<SuccessResponse<BranchType>>({
      success: true,
      message: "Branch",
      data: { ...branch },
    });
  })
  .patch(
    "/",
    zValidator("query", IdSchema),
    zValidator("form", branchUpdateSchema),
    AdministratorMiddleware,
    SessionMiddleware,
    async (c) => {
      const { name, username } = c.req.valid("form");
      const { id } = c.req.valid("query");
      const user = c.get("user")!;

      try {
        const [update] = await db
          .update(BranchTable)
          .set({ name, username })
          .where(
            and(
              eq(BranchTable.id, id),
              eq(BranchTable.companyId, user.companyId)
            )
          )
          .returning();

        return c.json<SuccessResponse<BranchType>>({
          success: true,
          message: "Successfully updated branch",
          data: { ...update },
        });
      } catch (error) {
        if (error instanceof DatabaseError && error.code === "23505") {
          throw new HTTPException(409, {
            message: "Branch already exists",
            cause: { form: true },
          });
        }
        throw new HTTPException(500, {
          message: "Failed to update branch",
          cause: { form: true },
        });
      }
    }
  )
  .patch(
    "/password/:id",
    zValidator("form", branchPasswordUpdateSchema),
    zValidator("query", IdSchema),
    AdministratorMiddleware,
    SessionMiddleware,
    async (c) => {
      const { password } = c.req.valid("form");
      const { id } = c.req.valid("query");
      const hash = await Bun.password.hash(password);
      const user = c.get("user")!;

      try {
        const [password] = await db
          .update(AccountTable)
          .set({ password: hash })
          .where(
            and(eq(AccountTable.id, user.accountId), eq(AccountTable.id, id))
          )
          .returning({ id: AccountTable.id });

        return c.json<SuccessResponse<{ id: string }>>({
          success: true,
          message: "Successfully updated password",
          data: { id: password.id },
        });
      } catch (error) {
        throw new HTTPException(500, {
          message: "Failed to update password",
          cause: { form: true },
        });
      }
    }
  )
  .delete(
    "/",
    zValidator("query", IdSchema),
    AdministratorMiddleware,
    SessionMiddleware,
    async (c) => {
      const { id } = c.req.valid("query");
      const user = c.get("user")!;

      const deleted = await db
        .delete(BranchTable)
        .where(
          and(
            eq(BranchTable.id, id),
            eq(BranchTable.companyId, user.companyId),
            ne(BranchTable.type, "administrator")
          )
        );

      if (!deleted) {
        throw new HTTPException(404, {
          message: "Branch not found or cannot be deleted",
        });
      }

      return c.json<SuccessResponse>({
        success: true,
        message: "Successfully deleted branch",
      });
    }
  );
