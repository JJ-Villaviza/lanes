import { authenticationRoutes } from "./authentication";
import { branchRoutes } from "./branch";
import { companyRoutes } from "./company";

export const routes = [
  authenticationRoutes,
  branchRoutes,
  companyRoutes,
] as const;

export type AppType = (typeof routes)[number];
