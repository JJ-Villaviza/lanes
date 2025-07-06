import { useAppForm } from "@/components/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRegisterMutation } from "@/service/mutations/authentication";
import { registerSchema } from "@/shared/validations/authentication";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authentication/register")({
  component: RouteComponent,
});

function RouteComponent() {
  const mutate = useRegisterMutation();
  const form = useAppForm({
    defaultValues: {
      name: "",
      businessName: "",
      email: "",
      username: "",
      password: "",
    },
    validators: {
      onChange: registerSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      await mutate.mutateAsync(value);
      formApi.reset();
    },
  });

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Register account</CardTitle>
        <CardDescription>Enter details to register an account</CardDescription>
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
              name="name"
              children={(field: any) => (
                <field.TextField label="Name" type="text" />
              )}
            />
            <form.AppField
              name="businessName"
              children={(field: any) => (
                <field.TextField label="Business Name" type="text" />
              )}
            />
            <form.AppField
              name="email"
              children={(field: any) => (
                <field.TextField label="Email" type="email" />
              )}
            />
            <form.AppField
              name="username"
              children={(field: any) => (
                <field.TextField label="Username" type="text" />
              )}
            />
            <form.AppField
              name="password"
              children={(field: any) => (
                <field.TextField label="Password" type="password" />
              )}
            />
            <form.AppForm>
              <form.SubmitButton>Register</form.SubmitButton>
            </form.AppForm>
          </div>
        </form>
        <div className="pt-6 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="underline underline-offset-4">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
