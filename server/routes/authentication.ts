import {
  loginSchema,
  registerSchema,
} from "@/shared/validations/authentication";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

export const authenticationRoutes = new Hono()
  .basePath("/api/auth")
  .post("/login", zValidator("form", loginSchema), async (c) => {
    const { username, password } = c.req.valid("form");

    return c.json(
      { message: "Successfully login", data: { username, password } },
      200
    );
  })
  .post("/register", zValidator("form", registerSchema), async (c) => {
    const { name, businessName, email, username, password } =
      c.req.valid("form");
    const hash = await Bun.password.hash(password);

    return c.json(
      {
        message: "Successfully registered",
        data: { name, businessName, email, username, password: hash },
      },
      201
    );
  })
  .get("/sign-out", async (c) => {
    return c.json({ message: "Sign out successful" }, 200);
  })
  .get("/", async (c) => {
    return c.json({ message: "Branch Details" }, 200);
  });
