import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { routes } from "./routes";

const app = new Hono();

app.use(logger()).use(cors());

routes.forEach((route) => app.route("/", route));

export default app;
