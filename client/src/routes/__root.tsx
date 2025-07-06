import { AuthData } from "@/shared/types/client-auth";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

type RootContext = {
  auth: AuthData;
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RootContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Outlet />
      <ReactQueryDevtools position="bottom" />
      <TanStackRouterDevtools position="bottom-left" />
    </>
  );
}
