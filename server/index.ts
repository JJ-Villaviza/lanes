import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { routes } from "./routes";
import type { Context } from "./context";

export const app = new Hono<Context>();

app.use(logger()).use(cors());

routes.forEach((route) => app.route("/", route));

export default app;
