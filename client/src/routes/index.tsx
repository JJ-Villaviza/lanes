import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomeComponent,
  beforeLoad: () => {
    throw redirect({ to: "/login" });
  },
});

function HomeComponent() {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
    </div>
  );
}
