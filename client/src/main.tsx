import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { routeTree } from "./routeTree.gen";
import { AuthData } from "../../shared/types/client-auth";
import { useAuth } from "./hooks/use-auth";
import "./globals.css";
import { Toaster } from "./components/ui/sonner";

const queryClient = new QueryClient();

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  context: {
    auth: null as unknown as AuthData,
    queryClient,
  },
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app")!;

const ReactQueryProviderWithContext = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProviderWithContext />
      <Toaster />
    </QueryClientProvider>
  );
};

const RouterProviderWithContext = () => {
  const auth = useAuth();

  return <RouterProvider router={router} context={{ auth }} />;
};

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<ReactQueryProviderWithContext />);
}

export { router };
