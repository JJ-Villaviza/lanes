import { AnyFieldMeta } from "@tanstack/react-form";
import { ZodError } from "zod";

type Props = {
  meta: AnyFieldMeta;
};

export const FieldErrors = ({ meta }: Props) => {
  if (!meta.isTouched) return null;

  return meta.errors.map(({ message }: ZodError, index) => (
    <p key={index} className="text-sm font-medium text-destructive">
      {message}
    </p>
  ));
};
