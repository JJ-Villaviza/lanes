import type { Context } from "@/context";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

export const AdministratorMiddleware = createMiddleware<Context>(
  async (c, next) => {
    const user = c.get("user");

    if (user && user.type === "branch") {
      throw new HTTPException(401, {
        message: "Unauthorized access",
      });
    }

    await next();
  }
);
