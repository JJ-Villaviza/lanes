import { hc } from "hono/client";
import { AppType } from "../../../server/routes";

export const client = hc<AppType>("http://localhost:3000", {
  fetch: (input: RequestInfo | URL, init?: RequestInit) =>
    fetch(input, {
      ...init,
      credentials: "include",
    }),
}).api;
