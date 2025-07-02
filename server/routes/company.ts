import type { Context } from "@/context";
import { db } from "@/database";
import { BranchTable, CompanyTable } from "@/database/schemas";
import { AdministratorMiddleware } from "@/middleware/administrator";
import { SessionMiddleware } from "@/middleware/session";
import type { SuccessResponse } from "@/shared/response";
import { CompanySchema } from "@/shared/validations/company";
import { IdSchema } from "@/shared/validations/id";
import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { DatabaseError } from "pg";

export const companyRoutes = new Hono<Context>()
  .basePath("/api/company") // ? Base path for company routes

  // TODO: create route for additional details of company
  .patch(
    "/",
    zValidator("form", CompanySchema),
    zValidator("query", IdSchema),
    AdministratorMiddleware,
    SessionMiddleware,
    async (c) => {
      const { businessName, email, description, mission, vision } =
        c.req.valid("form");
      const { id } = c.req.valid("query");
      const user = c.get("user")!;

      try {
        const [update] = await db
          .update(CompanyTable)
          .set({ businessName, email, description, mission, vision })
          .where(
            and(eq(CompanyTable.id, id), eq(CompanyTable.id, user.companyId))
          )
          .returning();

        return c.json<
          SuccessResponse<{
            id: string;
            businessName: string;
            email: string;
            description: string | null;
            mission: string | null;
            vision: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
          }>
        >(
          {
            success: true,
            message: "Successfully updated company",
            data: { ...update },
          },
          200
        );
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

  // TODO: create route for getting company details
  .get("/", zValidator("query", IdSchema), async (c) => {
    const { id } = c.req.valid("query");

    const [company] = await db
      .select()
      .from(CompanyTable)
      .where(eq(CompanyTable.id, id))
      .limit(1);
    if (!company) {
      throw new HTTPException(404, {
        message: "Company not found",
      });
    }

    return c.json<
      SuccessResponse<{
        id: string;
        businessName: string;
        email: string;
        description: string | null;
        mission: string | null;
        vision: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
      }>
    >({
      success: true,
      message: "Company details:",
      data: { ...company },
    });
  })

  // TODO: create route for getting branches of a company
  .get("/list", zValidator("query", IdSchema), async (c) => {
    const { id } = c.req.valid("query");

    const [list] = await db
      .select()
      .from(BranchTable)
      .where(eq(BranchTable.companyId, id));

    if (list === null) {
      throw new HTTPException(404, {
        message: "No branches found for this company",
      });
    }

    return c.json<
      SuccessResponse<
        {
          id: string;
          name: string;
          username: string;
          type: string;
          accountId: string;
          companyId: string;
          createdAt: Date;
          updatedAt: Date;
          deletedAt: Date | null;
        }[]
      >
    >({
      success: true,
      message: "Branches list:",
      data: [list],
    });
  })

  // TODO: create route for deactivating company
  .patch(
    "/deactivate",
    zValidator("query", IdSchema),
    SessionMiddleware,
    AdministratorMiddleware,
    async (c) => {
      const { id } = c.req.valid("query");
      const user = c.get("user")!;
      const date = new Date(Date.now());

      const [company] = await db
        .update(CompanyTable)
        .set({ deletedAt: null })
        .where(
          and(eq(CompanyTable.id, id), eq(CompanyTable.id, user.companyId))
        )
        .returning({
          id: CompanyTable.id,
          businessName: CompanyTable.businessName,
        });

      const branches = await db
        .update(BranchTable)
        .set({ deletedAt: date })
        .where(
          and(
            eq(BranchTable.companyId, id),
            eq(BranchTable.companyId, user.companyId),
            eq(BranchTable.type, "branch")
          )
        )
        .returning({ id: BranchTable.id, name: BranchTable.name });

      return c.json<
        SuccessResponse<{
          id: string;
          company: string;
          branches: {
            id: string;
            name: string;
          }[];
        }>
      >({
        success: true,
        message: "Successfully activated company",
        data: {
          id: company.id,
          company: company.businessName,
          branches: [...branches],
        },
      });
    }
  )

  // TODO: create route for activating company
  .patch(
    "/activate",
    zValidator("query", IdSchema),
    SessionMiddleware,
    AdministratorMiddleware,
    async (c) => {
      const { id } = c.req.valid("query");
      const user = c.get("user")!;

      const [company] = await db
        .update(CompanyTable)
        .set({ deletedAt: null })
        .where(
          and(eq(CompanyTable.id, id), eq(CompanyTable.id, user.companyId))
        )
        .returning({
          id: CompanyTable.id,
          businessName: CompanyTable.businessName,
        });
      if (!company) {
        throw new HTTPException(404, {
          message: "Company not found or cannot be activated",
        });
      }

      const branches = await db
        .update(BranchTable)
        .set({ deletedAt: null })
        .where(
          and(
            eq(BranchTable.companyId, id),
            eq(BranchTable.companyId, user.companyId),
            eq(BranchTable.type, "branch")
          )
        )
        .returning({ id: BranchTable.id, name: BranchTable.name });

      return c.json<
        SuccessResponse<{
          id: string;
          company: string;
          branches: { id: string; name: string }[];
        }>
      >({
        success: true,
        message: "Successfully activated company",
        data: {
          id: company.id,
          company: company.businessName,
          branches: [...branches],
        },
      });
    }
  )

  // TODO: create route for permanently removing company
  .delete(
    "/",
    zValidator("query", IdSchema),
    SessionMiddleware,
    AdministratorMiddleware,
    async (c) => {
      const { id } = c.req.valid("query");
      const user = c.get("user")!;

      const [company] = await db
        .delete(CompanyTable)
        .where(
          and(eq(CompanyTable.id, id), eq(CompanyTable.id, user.companyId))
        )
        .returning({
          id: CompanyTable.id,
          businessName: CompanyTable.businessName,
        });

      const branches = await db
        .delete(BranchTable)
        .where(
          and(
            eq(BranchTable.companyId, company.id),
            eq(BranchTable.companyId, user.companyId)
          )
        )
        .returning({ id: BranchTable.id, name: BranchTable.name });

      return c.json<
        SuccessResponse<{
          id: string;
          company: string;
          branches: { id: string; name: string }[];
        }>
      >({
        success: true,
        message: "Successfully permanently remove company",
        data: {
          id: company.id,
          company: company.businessName,
          branches: [...branches],
        },
      });
    }
  );
