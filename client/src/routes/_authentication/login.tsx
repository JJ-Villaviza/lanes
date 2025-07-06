import { useAppForm } from "@/components/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLoginMutation } from "@/service/mutations/authentication";
import { InferLoginSchema } from "@/shared/types/validation";
import { loginSchema } from "@/shared/validations/authentication";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authentication/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const mutate = useLoginMutation();

  const form = useAppForm({
    defaultValues: {
      username: "",
      password: "",
    } as InferLoginSchema,
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      await mutate.mutateAsync(value);
      formApi.reset();
    },
  });

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Login account</CardTitle>
        <CardDescription>Enter account username and password</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="grid gap-6">
            <form.AppField
              name="username"
              children={(field: any) => (
                <field.TextField label="Username" type="text" />
              )}
            />
            <form.AppField
              name="password"
              children={(field: any) => (
                <field.TextField label="Password" type="password" password />
              )}
            />
            <form.AppForm>
              <form.SubmitButton>Login</form.SubmitButton>
            </form.AppForm>
          </div>
        </form>
        <div className="pt-6 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="underline underline-offset-4">
            Register
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
