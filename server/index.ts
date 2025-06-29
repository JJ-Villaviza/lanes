import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { routes } from "./routes";
import type { Context } from "./context";
import { HTTPException } from "hono/http-exception";
import type { ErrorResponse } from "@/shared/response";
import { env } from "@/shared/env";

export const app = new Hono<Context>();

app.use(logger()).use(cors());

routes.forEach((route) => app.route("/", route));

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    const errResponse =
      err.res ??
      c.json<ErrorResponse>(
        {
          success: false,
          error: err.message,
          isFormError:
            err.cause && typeof err.cause === "object" && "form" in err.cause
              ? err.cause.form === true
              : false,
        },
        err.status
      );
    return errResponse;
  }

  return c.json<ErrorResponse>(
    {
      success: false,
      error:
        env.NODE_ENV === "production"
          ? "Interal Server Error"
          : err.stack ?? err.message,
    },
    500
  );
});

export default app;
