import { authenticationRoutes } from "./authentication";

export const routes = [authenticationRoutes] as const;

export type AppType = (typeof routes)[number];
