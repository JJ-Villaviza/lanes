import { authenticationRoutes } from "./authentication";
import { branchRoutes } from "./branch";

export const routes = [authenticationRoutes, branchRoutes] as const;

export type AppType = (typeof routes)[number];
