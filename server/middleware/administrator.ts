import type { Context } from "@/context";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

export const AdministratorMiddleware = createMiddleware<Context>(
  async (c, next) => {
    const user = c.get("user");

    if (user && user.type === "administrator") {
      throw new HTTPException(401, {
        message: "Administrator access is not allowed for this route.",
      });
    }

    await next();
  }
);
