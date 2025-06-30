import type { Context } from "@/context";
import { db } from "@/database";
import { BranchTable, CompanyTable } from "@/database/schemas";
import { AdministratorMiddleware } from "@/middleware/administrator";
import { SessionMiddleware } from "@/middleware/session";
import type { SuccessResponse } from "@/shared/response";
import type { BranchType, CompanyType } from "@/shared/types/schemas";
import { CompanySchema } from "@/shared/validations/company";
import { IdSchema } from "@/shared/validations/id";
import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { DatabaseError } from "pg";

export const companyRoutes = new Hono<Context>()
  .basePath("/api/company")
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

        return c.json<SuccessResponse<CompanyType>>(
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

    return c.json<SuccessResponse<CompanyType>>({
      success: true,
      message: "Company details:",
      data: { ...company },
    });
  })

  .get("/list", zValidator("query", IdSchema), async (c) => {
    const { id } = c.req.valid("query");

    const list = await db
      .select()
      .from(BranchTable)
      .where(eq(BranchTable.companyId, id));

    if (list.length === 0) {
      throw new HTTPException(404, {
        message: "No branches found for this company",
      });
    }

    return c.json<SuccessResponse<BranchType[]>>({
      success: true,
      message: "Branches list:",
      data: [...list],
    });
  });
