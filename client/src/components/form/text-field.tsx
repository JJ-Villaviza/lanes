import { Link } from "@tanstack/react-router";
import { useFieldContext } from ".";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FieldErrors } from "./field-errors";

type Props = {
  label: string;
  password: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const TextField = ({ label, password, ...inputProps }: Props) => {
  const field = useFieldContext<string>();

  return (
    <>
      <div className="grid gap-3">
        {password ? (
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/forget-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
        ) : (
          <Label htmlFor={field.name}>{label}</Label>
        )}
        <Input
          id={field.name}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          {...inputProps}
        />
      </div>
      <FieldErrors meta={field.state.meta} />
    </>
  );
};
