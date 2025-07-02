import type { Context } from "@/context";
import { db } from "@/database";
import { AccountTable, BranchTable } from "@/database/schemas";
import { AdministratorMiddleware } from "@/middleware/administrator";
import { SessionMiddleware } from "@/middleware/session";
import type { SuccessResponse } from "@/shared/response";
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
  .basePath("/api/branch") // ? Base path for branch routes

  // TODO: create route for additional branch
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
            .values({ password: hash, companyId: user.companyId })
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

        return c.json<
          SuccessResponse<{
            id: string;
            name: string;
            username: string;
            type: string;
            accountId: string;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
          }>
        >(
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

  // TODO: create route for reading branch details
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

    return c.json<
      SuccessResponse<{
        id: string;
        name: string;
        username: string;
        type: string;
        accountId: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
      }>
    >({
      success: true,
      message: "Branch",
      data: { ...branch },
    });
  })

  // TODO: create route for permanently remove branch
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
  )

  // TODO: create route for updating branch details
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

        return c.json<
          SuccessResponse<{
            id: string;
            name: string;
            username: string;
            type: string;
            accountId: string;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
          }>
        >({
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

  // TODO: create route for changing branch password
  .patch(
    "/password",
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
            and(
              eq(AccountTable.id, id),
              eq(AccountTable.companyId, user.companyId)
            )
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

  // TODO: create route for deactivating branch
  .patch(
    "/deactivate",
    zValidator("query", IdSchema),
    SessionMiddleware,
    AdministratorMiddleware,
    async (c) => {
      const { id } = c.req.valid("query");
      const user = c.get("user")!;
      const date = new Date(Date.now());

      const [update] = await db
        .update(BranchTable)
        .set({ deletedAt: date })
        .where(
          and(
            eq(BranchTable.id, id),
            eq(BranchTable.companyId, user.companyId),
            eq(BranchTable.type, "branch")
          )
        )
        .returning({ id: BranchTable.id, name: BranchTable.name });

      if (!update) {
        throw new HTTPException(404, {
          message: "Branch not found or cannot be activated",
        });
      }

      return c.json<SuccessResponse<{ id: string; name: string }>>({
        success: true,
        message: "Successfully activated branch",
        data: { ...update },
      });
    }
  )

  // TODO: create route for activating branch
  .patch(
    "/activate",
    zValidator("query", IdSchema),
    SessionMiddleware,
    AdministratorMiddleware,
    async (c) => {
      const { id } = c.req.valid("query");
      const user = c.get("user")!;

      const [update] = await db
        .update(BranchTable)
        .set({ deletedAt: null })
        .where(
          and(
            eq(BranchTable.id, id),
            eq(BranchTable.companyId, user.companyId),
            eq(BranchTable.type, "branch")
          )
        )
        .returning({ id: BranchTable.id, name: BranchTable.name });

      if (!update) {
        throw new HTTPException(404, {
          message: "Branch not found or cannot be activated",
        });
      }

      return c.json<SuccessResponse<{ id: string; name: string }>>({
        success: true,
        message: "Successfully activated branch",
        data: { ...update },
      });
    }
  );
